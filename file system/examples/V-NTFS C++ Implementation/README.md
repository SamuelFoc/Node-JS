# Virtual File System (V - NTFS)

This project implements a simplified version of a virtual file system (VFS) using C++. It mimics some functionalities of the NTFS file system, such as creating directories, creating files, renaming files, and deleting files. The file system's metadata is managed using JSON format, allowing easy storage and retrieval of file information.

## Features

- Create directories
- Create files with content
- Rename files
- Delete files
- List files and directories

## Prerequisites

To build and run this project, you need:

- **C++ Compiler**: Make sure you have `g++` installed on your Windows machine. You can install it through [MinGW](https://www.mingw-w64.org/downloads/).
- **nlohmann/json Library**: This project uses the [nlohmann/json](https://github.com/nlohmann/json) library for handling JSON. You can download the header file `json.hpp` from the GitHub repository.

## Installation

1. **Clone the repository** or download the source files:
   ```bash
   git clone https://github.com/SamuelFoc/Node-JS
   ```

or download the `json.hpp` file directly from the [nlohmann/json repository](https://github.com/nlohmann/json/releases).

2. **Place the files**: Ensure that your project directory has the following structure:

   ```
   C:\
   ├── virtual_fs.cpp        // C++ source code
   └── json.hpp              // JSON library header file
   ```

3. **Compile the program**: Open Command Prompt and navigate to the directory where your files are located. Run:

   ```bash
   g++ -std=c++17 -o virtual_fs virtual_fs.cpp
   ```

4. **Run the program**: After successful compilation, run:
   ```bash
   virtual_fs.exe
   ```

## Usage

Once the program is running, you can use the following commands:

- **Create a directory**:

  ```bash
  mkdir <directory_name>
  ```

- **Create a file with content**:

  ```bash
  mkfile <file_path> "<file_content>"
  ```

- **Rename a file**:

  ```bash
  rename <old_file_path> <new_file_path>
  ```

- **Delete a file**:

  ```bash
  rm <file_path>
  ```

- **List files and directories**:

  ```bash
  ls
  ```

- **Exit the program**:
  ```bash
  exit
  ```

## Example

Here’s a brief example of using the commands:

```bash
> mkdir my_folder
> mkfile my_folder/test_file.txt "Hello, world!"
> ls
my_folder/
> rename my_folder/test_file.txt my_folder/renamed_file.txt
> rm my_folder/renamed_file.txt
> exit
```

## License

This project is open source. Feel free to modify and distribute it under your own terms.

```

### Explanation of Each Section:

- **Project Overview**: A brief description of what the project does.
- **Features**: A list of functionalities available in the VFS.
- **Prerequisites**: Requirements needed to build and run the project.
- **Installation**: Step-by-step instructions on how to set up the project.
- **Usage**: Commands you can use once the program is running.
- **Example**: A quick demonstration of how to use the commands.
- **License**: Information about the open-source nature of the project.

You can modify any part of the `README.md` to better suit your project's specifics or add any additional information that might be relevant!
```
