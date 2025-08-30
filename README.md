🔥 WiFi Handshake Toolkit
https://img.shields.io/badge/version-1.0-blue
https://img.shields.io/badge/license-MIT-green
https://img.shields.io/badge/status-In_Progress-yellow
https://img.shields.io/badge/Python-3.x-orange
https://img.shields.io/badge/Dependencies-Aircrack--ng-red
https://img.shields.io/badge/Scapy-Network_Tools-purple

📋 Project Description
An automated WiFi handshake capture, cracking, and conversion toolkit built with Python.
Designed for educational & lab use only, it provides a simple interactive terminal GUI with colorful menus, target selection, and built-in cracking support.

🌟 Features
📡 Network Scanning – Scan WiFi networks with airodump-ng

🔓 Handshake Capture – Capture WPA/WPA2 handshakes automatically

🔑 Password Cracking – Crack handshakes using aircrack-ng and a wordlist

🔄 Convert to Hashcat Format – .cap → .hc22000 via hcxpcapngtool

⚙️ Configurable Settings – Adjust scan duration, deauth count, wait time

🎨 Colorful Terminal UI – Easy navigation with menus & tables

⚠️ Disclaimer
This toolkit is strictly for educational and lab/testing use.
⚡ Do not use against networks you don't own or have permission to test.

🛠️ Installation
Clone the repository

bash
git clone https://github.com/<your-username>/auto_aircrack_lab.git
cd auto_aircrack_lab
Install dependencies

bash
pip install -r requirements.txt
Install system tools (Debian/Ubuntu/Kali)

bash
sudo apt update
sudo apt install aircrack-ng hcxtools
Make script executable

bash
chmod +x auto_aircrack_lab.py
⚙️ Configuration
Default settings are inside the script:

python
SCAN_DURATION = 20      # seconds for scan
DEAUTH_PACKETS = 5      # number of deauth packets
CAPTURE_WAIT = 15       # wait after deauth
You can update them via the Settings Menu inside the tool.

▶️ Running the Tool
Start the script (requires root):

bash
sudo ./auto_aircrack_lab.py wlan0
Follow the interactive menu:

Select target network(s)

Capture handshake(s)

Crack or convert them

📦 Dependencies
System Tools:
aircrack-ng

airodump-ng

aireplay-ng

hcxpcapngtool (from hcxtools)

Python Libraries:
scapy

colorama

tabulate

Install Python dependencies:

bash
pip install -r requirements.txt
📁 Project Structure
text
auto_aircrack_lab/
├── auto_aircrack_lab.py  # Main script
├── requirements.txt      # Python dependencies
├── handshakes/          # Directory for captured handshakes
├── wordlists/           # Directory for password wordlists
├── results/             # Directory for cracked passwords
└── README.md            # This file
🖥️ Usage Examples
Scan for networks:

text
sudo ./auto_aircrack_lab.py wlan0
Select a target from the list

Capture handshake automatically

Crack with built-in wordlist or custom one

Convert to Hashcat format for advanced cracking

🔧 Troubleshooting
Monitor mode not working:

Ensure your wireless card supports monitor mode

Check for conflicting processes with sudo airmon-ng check kill

Handshake not captured:

Try increasing deauth packets or wait time

Ensure you're close enough to the target network

Dependencies missing:

Verify all required packages are installed: sudo apt install aircrack-ng hcxtools

🤝 Contributing
Contributions are welcome!

Fork the repo

Create a feature branch

Submit a pull request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Aircrack-ng team for the excellent wireless tools

Scapy project for packet manipulation capabilities

Hashcat team for advanced password recovery techniques

