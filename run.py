import subprocess
import os

# Get the current directory (where this script is located)
current_directory = os.path.dirname(os.path.abspath(__file__))

# Change to the current directory
os.chdir(current_directory)

# Run npm install to install dependencies
try:
    print("Installing dependencies...")
    subprocess.run(['npm', 'install'], check=True)
    print("Dependencies installed successfully.")
except subprocess.CalledProcessError as e:
    print(f"Error occurred during npm install: {e}")

# Run the npm start script
try:
    print("Starting the application...")
    subprocess.run(['npm', 'run', 'start'], check=True)
except subprocess.CalledProcessError as e:
    print(f"Error occurred while starting the app: {e}")
