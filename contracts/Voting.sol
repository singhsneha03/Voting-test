pragma solidity ^0.8.0;

contract Voting {
    // Structure to store candidate info
    struct Candidate {
        string name;
        uint voteCount;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Mapping to track who has voted
    mapping(address => bool) public voters;

    // Constructor to initialize candidates
    constructor(string[] memory candidateNames) {
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({
                name: candidateNames[i],
                voteCount: 0
            }));
        }
    }

    // Function to vote
    function vote(uint candidateIndex) public {
        require(!voters[msg.sender], "You have already voted!");
        require(candidateIndex < candidates.length, "Invalid candidate!");

        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;
    }

    // Function to get all candidates
    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}