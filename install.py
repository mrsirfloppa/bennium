import os
import subprocess
import sys

def log_info(message):
    print(f"[INFO] {message}")

def log_error(message):
    print(f"[ERROR] {message}")
    sys.exit(1)

def check_node():
    try:
        subprocess.check_output(["node", "-v"], stderr=subprocess.STDOUT)
        log_info("Node.js is installed.")
    except subprocess.CalledProcessError:
        log_error("Node.js could not be found. Please install Node.js and npm.")
    except FileNotFoundError:
        log_error("Node.js could not be found. Please install Node.js and npm.")

def install_dependencies():
    log_info("Installing dependencies...")
    try:
        npm_path = r"C:\Program Files\nodejs\npm.cmd"  # Full path to npm.cmd
        subprocess.check_call([npm_path, "install"])
        log_info("Dependencies installed successfully.")
    except subprocess.CalledProcessError:
        log_error("Failed to install dependencies.")
    except FileNotFoundError:
        log_error(f"npm could not be found at {npm_path}. Please ensure Node.js and npm are installed correctly.")

def create_bennium_bat():
    bat_content = (
        "@echo off\n"
        f"npm start --prefix \"{os.getcwd()}\"\n"
    )

    with open("bennium.bat", "w") as bat_file:
        bat_file.write(bat_content)
    
    if os.path.exists("bennium.bat"):
        log_info("bennium.bat created successfully.")
    else:
        log_error("Failed to create bennium.bat.")

def add_to_path():
    current_dir = os.getcwd()
    path = os.environ['PATH']
    if current_dir not in path:
        log_info("Adding the current directory to PATH...")
        subprocess.run(f'setx PATH "{path};{current_dir}"', shell=True)
        log_info("Successfully added directory to PATH.")
    else:
        log_info("Current directory is already in PATH.")

def main():
    check_node()
    install_dependencies()
    create_bennium_bat()
    add_to_path()

    log_info("Installation complete. You can now run the browser using the command 'bennium'.")
    log_info("Starting the application...")
    subprocess.run(["bennium.bat"])

if __name__ == "__main__":
    main()
