import os
import subprocess
import sys

def log_info(message):
    print(f"[INFO] {message}")

def log_error(message):
    print(f"[ERROR] {message}")
    sys.exit(1)

def remove_bennium_bat():
    bat_path = os.path.join(os.getcwd(), "bennium.bat")
    if os.path.exists(bat_path):
        os.remove(bat_path)
        if not os.path.exists(bat_path):
            log_info("bennium.bat removed successfully.")
        else:
            log_error("Failed to remove bennium.bat.")
    else:
        log_info("bennium.bat does not exist, nothing to remove.")

def remove_from_path():
    current_dir = os.getcwd()
    path = os.environ['PATH']

    if current_dir in path:
        new_path = ";".join([p for p in path.split(";") if p != current_dir])
        log_info("Removing the current directory from PATH...")
        subprocess.run(f'setx PATH "{new_path}"', shell=True)
        log_info("Successfully removed the directory from PATH.")
    else:
        log_info("Current directory is not in PATH, nothing to remove.")

def main():
    remove_bennium_bat()

    # Optionally remove the directory from PATH
    remove_from_path()

    log_info("Uninstallation complete.")

if __name__ == "__main__":
    main()
