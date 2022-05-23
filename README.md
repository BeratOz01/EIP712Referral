# EIP-712 Signature Implementation on Blockhain Based Referral System

#### Information
* On chain sign verification system with [EIP-712](https://eips.ethereum.org/EIPS/eip-712) hashing and signature on Referral System like Stepn. Only valid users can create referral for another users. Valid user can create referral as many as user want. But after 5 referral accepted, others considered as invalid and contract throw an Error. 
* With EIP712 implementation, creator of referral do not need to send transaction for every referral. Only receiver will send transaction to join.
* For create or submit a referral, every user need to sign a random nonce coming for backend server. With this kind of authentication, backend server can give and JWT token for protected routes for updating data in centralized database (MongoDB)
* After sign random nonce, user can enter his/her email for receiving notification (Invitation & Submit users' referral).

#### Tech
* Node.js
* MongoDB
* React.js
* Hardhat
* Solidity
* JWT

### Screenshots

###### Home Page
![Home](https://user-images.githubusercontent.com/77115599/169899683-e1681740-03e4-41bf-894b-870258dd1b1e.jpg)

###### If user has valid referral, 
![submit](https://user-images.githubusercontent.com/77115599/169899697-e50618ff-7981-41bd-bebf-8d9c1394d098.jpg)

###### If user is valid referrer, 
![Create](https://user-images.githubusercontent.com/77115599/169899699-7d6db2bb-7d41-405f-b370-e34c91bbb326.jpg)
