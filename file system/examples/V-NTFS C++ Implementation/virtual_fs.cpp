#include <iostream>
#include <fstream>
#include <vector>
#include <filesystem>
#include <string>
#include "json.hpp"

namespace fs = std::filesystem;
using json = nlohmann::json;

const int BLOCK_SIZE = 4096; // 4KB blocks

// File System Root
const std::string VFS_ROOT = "virtual_fs";
const std::string MFT_FILE = "MFT.json";

// Create the Master File Table JSON
json createMFT() {
    json mft;
    mft["root"] = {{"is_directory", true}, {"size", 0}, {"contents", {}}}; // Root directory
    return mft;
}

// Write MFT back to the MFT file
void writeMFT(const json& mft) {
    std::ofstream outFile(VFS_ROOT + "/" + MFT_FILE);
    outFile << mft.dump(4); // Pretty print with 4 spaces
}

// Load MFT from the file
json loadMFT() {
    std::ifstream inFile(VFS_ROOT + "/" + MFT_FILE);
    json mft;
    inFile >> mft;
    return mft;
}

// Split file content into blocks
std::vector<std::string> splitIntoBlocks(const std::string& content) {
    std::vector<std::string> blocks;
    int numBlocks = content.size() / BLOCK_SIZE + (content.size() % BLOCK_SIZE != 0);

    for (int i = 0; i < numBlocks; i++) {
        int start = i * BLOCK_SIZE;
        blocks.push_back(content.substr(start, BLOCK_SIZE));
    }
    return blocks;
}

// Write file blocks to virtual file system
void writeBlocksToFile(const std::string& fileName, const std::vector<std::string>& blocks) {
    for (size_t i = 0; i < blocks.size(); i++) {
        std::ofstream blockFile(VFS_ROOT + "/" + fileName + "_block_" + std::to_string(i) + ".txt");
        blockFile << blocks[i];
    }
}

// Create a directory in the virtual file system
void createDirectory(const std::string& dirName, json& mft) {
    if (mft.contains(dirName)) {
        std::cerr << "Directory '" << dirName << "' already exists!" << std::endl;
        return;
    }

    mft[dirName] = {{"is_directory", true}, {"size", 0}, {"contents", {}}};
    std::cout << "Directory '" << dirName << "' created!" << std::endl;
}

// Create a file in the virtual file system and write it in blocks
void createFile(const std::string& fileName, const std::string& content, json& mft) {
    if (mft.contains(fileName)) {
        std::cerr << "File '" << fileName << "' already exists!" << std::endl;
        return;
    }

    std::vector<std::string> blocks = splitIntoBlocks(content);
    writeBlocksToFile(fileName, blocks);

    // Update MFT with file metadata
    json fileEntry;
    fileEntry["is_directory"] = false;
    fileEntry["size"] = content.size();
    fileEntry["blocks"] = blocks.size();

    mft[fileName] = fileEntry;
    std::cout << "File '" << fileName << "' created with " << blocks.size() << " blocks!" << std::endl;
}

// Remove a file or directory
void removeEntry(const std::string& name, json& mft) {
    if (!mft.contains(name)) {
        std::cerr << "File or directory '" << name << "' not found!" << std::endl;
        return;
    }

    // If it's a file, remove its blocks
    if (!mft[name]["is_directory"]) {
        int blockCount = mft[name]["blocks"];
        for (int i = 0; i < blockCount; i++) {
            fs::remove(VFS_ROOT + "/" + name + "_block_" + std::to_string(i) + ".txt");
        }
    }

    // Remove the entry from MFT
    mft.erase(name);
    std::cout << "File or directory '" << name << "' removed!" << std::endl;
}

// Rename a file or directory
void renameEntry(const std::string& oldName, const std::string& newName, json& mft) {
    if (!mft.contains(oldName)) {
        std::cerr << "File or directory '" << oldName << "' not found!" << std::endl;
        return;
    }
    if (mft.contains(newName)) {
        std::cerr << "A file or directory with the name '" << newName << "' already exists!" << std::endl;
        return;
    }

    // Rename in MFT
    mft[newName] = mft[oldName];
    mft.erase(oldName);

    // If it's a file, rename the blocks
    if (!mft[newName]["is_directory"]) {
        int blockCount = mft[newName]["blocks"];
        for (int i = 0; i < blockCount; i++) {
            fs::rename(VFS_ROOT + "/" + oldName + "_block_" + std::to_string(i) + ".txt", 
                       VFS_ROOT + "/" + newName + "_block_" + std::to_string(i) + ".txt");
        }
    }

    std::cout << "Renamed '" << oldName << "' to '" << newName << "'!" << std::endl;
}

// List directory contents
void listDirectory(const json& mft, const std::string& dirName = "root") {
    if (!mft.contains(dirName) || !mft[dirName]["is_directory"]) {
        std::cerr << "Directory '" << dirName << "' not found!" << std::endl;
        return;
    }

    std::cout << "Contents of '" << dirName << "':" << std::endl;
    for (const auto& entry : mft.items()) {
        std::cout << "- " << entry.key();
        if (entry.value()["is_directory"]) {
            std::cout << " (dir)" << std::endl;
        } else {
            std::cout << " (file, " << entry.value()["size"] << " bytes)" << std::endl;
        }
    }
}

// Initialize the virtual file system if not already initialized
void initializeVFS() {
    if (!fs::exists(VFS_ROOT)) {
        fs::create_directory(VFS_ROOT);
        std::ofstream mftFile(VFS_ROOT + "/" + MFT_FILE);
        json mft = createMFT();
        writeMFT(mft);
    }
}

// Main loop for handling commands
void runCommandLoop(json& mft) {
    std::string command;

    while (true) {
        std::cout << "> ";
        std::getline(std::cin, command);

        std::istringstream iss(command);
        std::vector<std::string> args{std::istream_iterator<std::string>{iss}, std::istream_iterator<std::string>{}};

        if (args.empty()) continue;

        if (args[0] == "exit") {
            break;
        } else if (args[0] == "mkdir" && args.size() == 2) {
            createDirectory(args[1], mft);
        } else if (args[0] == "mkfile" && args.size() >= 3) {
            std::string content = command.substr(command.find(args[2]));
            createFile(args[1], content, mft);
        } else if (args[0] == "rm" && args.size() == 2) {
            removeEntry(args[1], mft);
        } else if (args[0] == "rename" && args.size() == 3) {
            renameEntry(args[1], args[2], mft);
        } else if (args[0] == "ls") {
            listDirectory(mft);
        } else {
            std::cout << "Unknown command or wrong usage!" << std::endl;
        }

        // Save changes to MFT after every command
        writeMFT(mft);
    }
}

int main() {
    // Step 1: Initialize the virtual file system
    initializeVFS();

    // Load the MFT
    json mft = loadMFT();

    // Step 2: Run the command loop
    runCommandLoop(mft);

    return 0;
}
