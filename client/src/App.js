import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Voting from "./Voting.json"; // Adjust path if needed
import "./App.css";

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");

    // Initialize Web3 and contract
    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                /*const web3Instance = new Web3(window.ethereum);*/
                await window.ethereum.enable();
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                setAccount(accounts[0]);

                const networkId = await web3Instance.eth.net.getId();
                const deployedNetwork = Voting.networks[networkId] || Voting.networks["5777"]; // Ganache default
                const contractInstance = new web3Instance.eth.Contract(
                    Voting.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setContract(contractInstance);

                loadCandidates(contractInstance);
            }
        };
        init();
    }, []);

    // Load candidates from the blockchain
    const loadCandidates = async (contractInstance) => {
        const candidateList = await contractInstance.methods.getCandidates().call();
        setCandidates(candidateList);
    };

    // Handle vote submission
    const handleVote = async () => {
        if (contract && selectedCandidate !== "") {
            await contract.methods.vote(selectedCandidate).send({ from: account });
            loadCandidates(contract); // Refresh candidates
        }
    };

    return (
        <div className="App">
            <h1>Decentralized Voting</h1>
            <p>Account: {account}</p>

            {/* Voting Form */}
            <div>
                <h2>Cast Your Vote</h2>
                <select
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                >
                    <option value="">Select a candidate</option>
                    {candidates.map((candidate, index) => (
                        <option key={index} value={index}>
                            {candidate.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleVote}>Vote</button>
            </div>

            {/* Candidate List */}
            <div>
                <h2>Candidates</h2>
                <ul>
                    {candidates.map((candidate, index) => (
                        <li key={index}>
                            {candidate.name}: {candidate.voteCount} votes
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;