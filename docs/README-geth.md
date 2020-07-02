# Geth

## Install Geth Dependencies
Download latest `go` package from the [offical Go repository](https://golang.org/dl/) and uncompress it to `/usr/local`
```sh
$ cd $HOME
$ curl -OL https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz
$ sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
# add GOPATH/GOROOT variable and updated path to $HOME/.bashrc
$ sh -c "echo 'export GOPATH=$HOME/go' >> $HOME/.bashrc"
$ sh -c "echo 'export GOROOT=/usr/local/go' >> $HOME/.bashrc"
$ sh -c "echo 'export PATH=$HOME/go/bin:$PATH:/usr/local/go/bin' >> $HOME/.bashrc"
```

### Build Geth and Swarm
```
$ git clone https://github.com/ethereum/go-ethereum.git
$ cd go-ethereum
$ git checkout v$LATEST_STABLE_RELEASE
$ make geth
$ make swarm
$ sudo cp build/bin/geth /usr/local/bin/geth
$ sudo cp build/bin/swarm /usr/local/bin/swarm
```
