import os
import shutil

def remove_bat_file():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    bat_file = os.path.join(current_dir, 'bennium.bat')
    if os.path.exists(bat_file):
        os.remove(bat_file)
        print(f"[INFO] Removed {bat_file}")
    else:
        print(f"[INFO] {bat_file} does not exist.")

def remove_from_path():
    print("[INFO] Removing Bennium from system PATH...")
    bennium_path = os.path.dirname(os.path.abspath(__file__))
    
    # Get the current PATH environment variable
    path_variable = os.environ.get('PATH', '')

    if bennium_path in path_variable:
        # Replace the Bennium path in the PATH variable with an empty string
        new_path_variable = path_variable.replace(bennium_path, '')
        
        # Update the PATH environment variable
        os.environ['PATH'] = new_path_variable
        
        # Update the PATH for the current session (non-persistent)
        os.system(f'setx PATH "{new_path_variable.strip(";")}"')
        
        print(f"[INFO] Bennium path removed from system PATH.")
    else:
        print(f"[INFO] Bennium path was not found in system PATH.")

def remove_node_modules():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    node_modules_dir = os.path.join(current_dir, 'node_modules')
    if os.path.exists(node_modules_dir):
        shutil.rmtree(node_modules_dir)
        print(f"[INFO] Removed {node_modules_dir}")
    else:
        print(f"[INFO] {node_modules_dir} does not exist.")

def main():
    print("[INFO] Uninstalling Bennium...")
    remove_bat_file()
    remove_from_path()
    remove_node_modules()
    print("[INFO] Uninstallation complete.")

if __name__ == "__main__":
    main()
