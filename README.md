# appworks-welly-final-proj

---
#### Description
- 此專案為去中心化公司評論社群，透過鏈上投票機制結合次方運算讓評論獎勵發送真實評論的人，若大家都不認同的言論則該評論建立者無法領取獎勵，也將於投票結束後公開大家的投票結果，進而反應評論的真實性
- 而評論獎勵的依據取決於贊成票與反對票之間的運算，參考 Quadratic Funding 機制，實現人多比錢多更有影響力的機制，最終結果若為同意較多，則透過系統運算將獎勵鑄造給發評論者。
#### Framework
- TransToken: 做為平台幣使用，可透過其 ERC20 Token 進行儲值與提領，並且結合治理功能，將此 Token 作為 delegate 代幣使用。
- CommentProxy: 此為 proxy 合約，負責實作 Comment。
- CommentV1: 為評論核心合約，包含紀錄各使用者的評論以及建立評論，並繼承 CommentGovernance，實作投票的功能。
- CommentGovernance: 負責評論在整個投票流程中的操作，包含紀錄票數以及投票等相關動作，並藉由 Timelock 控制投票過程的時程。
- RewardModelInterface: 當投票完畢後，需要計算評論者的評論是否有獲得大眾支持，並將其轉換成獎勵，鼓勵評論者真實的訴說言論。
- QuadraticRewardModel: 參考 Quadratic Funding 機制，實現人多比錢多更有影響力的機制，計算贊成與反對的比重後，將其轉換成獎勵提供給評論者。
- Timelock: 控制投票流程的合約，包含 queue, execute & cancel 機制。
- 流程圖如下:
![flowchart](https://storage.googleapis.com/appworks_final_project/flowcharts.png)

#### Development
#### Testing
#### Usage