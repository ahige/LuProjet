Vagrant.configure(2) do |config|
  
	# Set some variables
  etcHosts=""
  common = <<-SHELL
  sudo apt update -qq 2>&1 >/dev/null
  sudo apt install -y -qq git vim jq curl tree net-tools telnet 2>&1 >/dev/null
  sudo route add default gw 192.168.10.254 2>&1 >/dev/null
  sudo curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
  sudo python3 get-pip.py --user
  sudo echo "autocmd filetype yaml setlocal ai ts=2 sw=2 et" > /home/vagrant/.vimrc
  sed -i 's/ChallengeResponseAuthentication no/ChallengeResponseAuthentication yes/g' /etc/ssh/sshd_config 2>&1 >/dev/null
  sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config 2>&1 >/dev/null
  sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/g' /etc/ssh/sshd_config 2>&1 >/dev/null
  sudo systemctl restart sshd
  sudo sysctl -p
  sudo timedatectl set-timezone Europe/Paris
  SHELL

  commonwazagent = <<-SHELL
  sudo apt-get install -y docker.io docker-compose
  sudo systemctl restart docker
  sudo curl -so wazuh-agent-4.3.10.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.3.10-1_amd64.deb && sudo WAZUH_MANAGER='192.168.10.101' WAZUH_AGENT_GROUP='default' dpkg -i ./wazuh-agent-4.3.10.deb
  sudo systemctl daemon-reload
  sudo systemctl enable wazuh-agent
  sudo cp /test/ossec.conf /var/ossec/etc/ossec.conf
  sudo systemctl restart wazuh-agent
  sudo cp -r /projet/* /home/vagrant
  sudo docker-compose up -d
  SHELL

  commonwazmaster = <<-SHELL
  sudo curl -O https://packages.wazuh.com/4.3/wazuh-install.sh && sudo bash ./wazuh-install.sh -a
  sudo apt install tar 2>&1 > /dev/null
  sudo tar -xvf wazuh-install-files.tar wazuh-install-files/wazuh-passwords.txt
  systemctl restart wazuh-manager.service
  sudo cp wazuh-install-files/wazuh-passwords.txt /passwdWaz
  SHELL

  commonvmbkp = <<-SHELL
  sudo curl -so wazuh-agent-4.3.10.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.3.10-1_amd64.deb && sudo WAZUH_MANAGER='192.168.10.101' WAZUH_AGENT_GROUP='default' dpkg -i ./wazuh-agent-4.3.10.deb
  sudo systemctl daemon-reload
  sudo systemctl enable wazuh-agent
  sudo cp /test/ossec.conf /var/ossec/etc/ossec.conf
  sudo systemctl restart wazuh-agent
  sudo apt update
  sudo apt install rsync
  sudo mkdir /bkpWaz /bkpApp
  sudo rsync -avz -e ssh root@192.168.10.11:/var/ossec/ /bkpWaz
  sudo rsync -avz -e ssh root@192.168.10.12:/var/ossec/ /bkpApp
  SHELL

	# set servers list and their parameters
	NODES = [
    { :hostname => "vmWaz", :ip => "192.168.10.11", :cpus => 2, :mem => 4096, :box => "ubuntu/focal64", :box_url => "ubuntu/focal64" },
  	{ :hostname => "vmApp", :ip => "192.168.10.12", :cpus => 1, :mem => 512, :box => "debian/bullseye64", :box_url => "debian/bullseye64"  },
    { :hostname => "vmBkp", :ip => "192.168.10.13", :cpus => 1, :mem => 512, :box => "debian/bullseye64", :box_url => "debian/bullseye64" },
	]

	# define /etc/hosts for all servers
  NODES.each do |node|
   	etcHosts += "echo '" + node[:ip] + "   " + node[:hostname] + "' >> /etc/hosts" + "\n"
  end #end NODES

	# run installation
  NODES.each do |node|
    config.vm.define node[:hostname] do |cfg|
      cfg.vm.box = node[:box]
      cfg.vm.box_url = node[:box_url]
      cfg.vm.hostname = node[:hostname]
      cfg.vm.network "private_network", ip: node[:ip],
        virtualbox__intnet: true
      cfg.vm.provider "virtualbox" do |v|
				v.customize [ "modifyvm", :id, "--cpus", node[:cpus] ]
        v.customize [ "modifyvm", :id, "--memory", node[:mem] ]
        v.customize [ "modifyvm", :id, "--name", node[:hostname] ]
      end #end  
			
			#for all
      cfg.vm.provision :shell, :inline => etcHosts
      cfg.vm.provision :shell, :inline => common
      if node[:hostname] === "vmApp"
        cfg.vm.synced_folder "./etc", "/test"
        cfg.vm.synced_folder "./projet", "/projet"
        cfg.vm.provision :shell, :inline => commonwazagent
      elsif node[:hostname] === "vmWaz"
        cfg.vm.synced_folder "./etc", "/test"
        cfg.vm.provision :shell, :inline => commonwazmaster
        cfg.vm.synced_folder "./passwdWaz", "/passwdWaz"
      elsif node[:hostname] === "vmBkp"
        cfg.vm.synced_folder "./etc", "/test"
        cfg.vm.provision :shell, :inline => commonvmbkp
      end
    end # end config
  end # end nodes
end
