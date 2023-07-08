# appworks-welly-final-proj

---
#### Description
- Live Demo (Sepolia testnet): https://appworks-school-final-frontend-nvo6dvzb7q-de.a.run.app/
- 此專案為去中心化公司評論社群，透過鏈上投票機制結合次方運算讓評論獎勵發送真實評論的人，若該評論的認同者與反對者經過平方募資法運算後為負值，評論建立者則無法領取獎勵，最終顯示正反方之票數，反應評論的真實性。
- 評論獎勵的依據取決於贊成票與反對票之間的運算，參考 Quadratic Funding 機制，實現人多比錢多更有影響力的機制，最終結果若為同意票加權大於反對票加權，則透過系統運算將獎勵鑄造給發評論者。
#### Framework
- TransToken: 做為平台幣使用，可透過其 ERC20 Token 進行儲值與提領，並且結合治理功能，將此 Token 作為 delegate 代幣使用。
- CommentProxy: 此為 proxy 合約，負責紀錄實作合約 CommentV1。
- CommentV1: 為評論核心合約，包含紀錄各使用者的評論以及建立評論，並繼承 CommentGovernance，實作投票的功能。
- CommentGovernance: 負責評論在整個投票流程中的操作，包含紀錄票數以及投票等相關動作，並藉由 Timelock 控制投票過程的時程。
- RewardModelInterface: 當投票完畢後，需要計算評論者的評論是否有獲得大眾支持，並將其轉換成獎勵，鼓勵評論者真實的訴說言論。
- QuadraticRewardModel: 參考 Quadratic Funding 機制，實現人多比錢多更有影響力的機制，計算贊成與反對的比重後，將其轉換成獎勵提供給評論者。
- Timelock: 控制投票流程的合約，包含 queue, execute & cancel 機制。
- 合約架構圖如下:
![flowchart](https://storage.googleapis.com/appworks_final_project/flowcharts.png)

#### Development
- Contract
	Local Environment
	```
	anvil
	forge script script/Comment.s.sol:CommentScript --broadcast  --rpc-url http://127.0.0.1:8545 
	```
	Sepolia
  
    modify .env.example to .env
    ```
    ETHERSCAN_API_KEY=[your_etherscan_api_key]
    PRIVATE_KEY=[your_private_key]
    ```
    execute forge script to deploy contract on Sepolia testnet
	```
	forge script script/Comment.s.sol:CommentScript --broadcast --verify --rpc-url https://eth-sepolia.g.alchemy.com/v2/{api_key} 
	```

	final contract (Sepolia):
	- proxy: 0xDED2b3835E52d2a661cacB75eE852A09FB1A085D
	- commentV1: 0x12b2DE069B0ce62c4a865F98cBC31F837DE8138c
	- erc20: 0x35d95c919b63e763f1a179e09262cBaE657DdF35

- Frontend
	Local Environment
	```
	cd ./frontend
	yarn install
	yarn start 
	```
	Container
	```
	docker build -t "image_name" .
	docker run --name={container_name} -it -d -p 80:80 image_name:latest
	```	
#### Testing
+ Comment.t.sol
  - testProxiable() - 測試 Proxy 可以正常執行
  - testVoting() - 測試投票功能正常，並有正確新增票數與減少的票數
  - testClaimVotingReward() - 測試 Claim reward 功能運作正常
  - testCreateComment() - 測試使用者可以順利建立 Comment
  - testGetCommentDetails() - 測試使用者可以取得 Comment Details
  - testGetCommentsByAddress() - 測試使用者可以取得自己所建立之 Comments
  - testGetCommentsByCompany() - 測試使用者可以依照不同公司取得其評論
  - testCommentExecutable() - 測試評論於建立後僅有 1-7 天可以執行 Claim
+ TransToken.t.sol
  - testCheckMinter() - 測試僅有 allower 可以 mint token
  - testDeposit() - 測試使用者可以順利 Deposit ether
  - testMintByOwner() - 測試 owner 可以 min token
  - testOwnerIsMinter() - 測試 isMinter 功能
  - testTicketUsage() - 測試新增與消耗票的餘額正常
  - testAddonLimit() - 測試投票功能僅能一天使用一次
#### Usage

+ 系統有以下功能
  - 儲值 - 初始沒有 Token 時，沒辦法兌換票數進行投票，因此需要先儲值
  - 加值票數 - 可將 Token 1:1 兌換成票數，進行投票，每日限兌換一次
  - 建立評論 - 建立評論不用 Ether or Token，可以任意建立評論，等待網路投票
  - 投票 - 可針對自己喜歡或反對的評論給予投票，每人僅能針對一則評論投一次票
  - 獲取獎勵 - 建立評論者可於建立後 1 - 7 日，自行選定適當的時機 Claim reward 
