export const commentAbi = [{"inputs":[],"name":"DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"IS_REWARD_MODEL","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"commentId","type":"uint256"},{"internalType":"string","name":"companyName","type":"string"}],"name":"claimVotingReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_salary","type":"uint256"}],"name":"createComment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"commentId","type":"uint256"}],"name":"executeable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"commentId","type":"uint256"},{"internalType":"string","name":"companyName","type":"string"}],"name":"getCommentDetails","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"salary","type":"uint256"},{"internalType":"uint256","name":"createTime","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"enum CommentV1.Status","name":"status","type":"uint8"},{"components":[{"internalType":"uint256[]","name":"against","type":"uint256[]"},{"internalType":"uint256[]","name":"agree","type":"uint256[]"}],"internalType":"struct CommentV1.CommentVotes","name":"votes","type":"tuple"}],"internalType":"struct CommentV1.Comment","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getCommentsByAddress","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"salary","type":"uint256"},{"internalType":"uint256","name":"createTime","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"enum CommentV1.Status","name":"status","type":"uint8"},{"components":[{"internalType":"uint256[]","name":"against","type":"uint256[]"},{"internalType":"uint256[]","name":"agree","type":"uint256[]"}],"internalType":"struct CommentV1.CommentVotes","name":"votes","type":"tuple"}],"internalType":"struct CommentV1.Comment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_company","type":"string"}],"name":"getCommentsByCompany","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"salary","type":"uint256"},{"internalType":"uint256","name":"createTime","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"enum CommentV1.Status","name":"status","type":"uint8"},{"components":[{"internalType":"uint256[]","name":"against","type":"uint256[]"},{"internalType":"uint256[]","name":"agree","type":"uint256[]"}],"internalType":"struct CommentV1.CommentVotes","name":"votes","type":"tuple"}],"internalType":"struct CommentV1.Comment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCompanyList","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"commentId","type":"uint256"},{"internalType":"string","name":"companyName","type":"string"},{"internalType":"enum CommentV1.VoteTypes","name":"voteTypes","type":"uint8"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}]
export const commentProxyAddress = '0xDED2b3835E52d2a661cacB75eE852A09FB1A085D'