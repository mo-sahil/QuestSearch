import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filter, setFilter] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [anagramBlocks, setAnagramBlocks] = useState({});

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/search`, {
        query,
        page: currentPage,
        pageSize,
        type: filter,
      });

      const fetchedResults = response.data.questions || [];
      setResults(fetchedResults);
      setSelectedOptions({});

      const blocks = {};
      fetchedResults.forEach((question) => {
        if (question.type === 'ANAGRAM') {
          blocks[question.title] = [...question.blocks]; 
        }
      });
      setAnagramBlocks(blocks);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching search results. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleOptionClick = (questionId, optionIndex) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleBlockDragStart = (e, questionTitle, blockIndex) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ questionTitle, blockIndex }));
  };

  const handleBlockDrop = (e, questionTitle, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { questionTitle: sourceQuestionTitle, blockIndex: sourceIndex } = data;

    if (sourceQuestionTitle === questionTitle) {
      const updatedBlocks = [...anagramBlocks[questionTitle]];
      const [removed] = updatedBlocks.splice(sourceIndex, 1);
      updatedBlocks.splice(targetIndex, 0, removed);
      setAnagramBlocks((prev) => ({
        ...prev,
        [questionTitle]: updatedBlocks,
      }));
    }
  };

  const handleBlockDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (query.trim()) {
      handleSearch();
    }
  }, [currentPage]);

  return (
    <div className="search-container">
      <div className="search-box">
        <h1>QuestSearch</h1>

        <div className="search-controls">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for questions..."
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="CONTENT_ONLY">Content Only</option>
            <option value="ANAGRAM">Anagram</option>
            <option value="MCQ">MCQ</option>
            <option value="READ_ALONG">Read Along</option>
            <option value="CONVERSATION">Conversation</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className={isSearching || !query.trim() ? 'disabled' : ''}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {results.length > 0 ? (
          <div className="results">
            {results.map((item, index) => (
              <div key={index} className="result-item">
                <h3>{item.title}</h3>
                <p className="question-type">Type: {item.type}</p>
                {item.type === 'ANAGRAM' && (
                  <>
                    <p className="instruction">
                      {item.anagramType === 'word'
                        ? 'Arrange the letters to form the correct word:'
                        : 'Arrange the words to form the correct sentence:'}
                    </p>
                    <div className="anagram-blocks">
                      {anagramBlocks[item.title]?.map((block, idx) => (
                        <div
                          key={idx}
                          className="block"
                          draggable
                          onDragStart={(e) => handleBlockDragStart(e, item.title, idx)}
                          onDrop={(e) => handleBlockDrop(e, item.title, idx)}
                          onDragOver={handleBlockDragOver}
                        >
                          {block.text}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const userAnswer = anagramBlocks[item.title]
                          .map((block) => block.text)
                          .join(item.anagramType === 'word' ? '' : ' ');
                        if (userAnswer === item.solution) {
                          alert('Correct!');
                        } else {
                          alert('Incorrect. Try again.');
                        }
                      }}
                      className="check-answer"
                    >
                      Check Answer
                    </button>
                  </>
                )}
                {item.type === 'MCQ' && (
                  <>
                    <p className="instruction">Click on the right option:</p>
                    <ul>
                      {item.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={
                            selectedOptions[item.title] === idx
                              ? option.isCorrectAnswer
                                ? 'correct'
                                : 'incorrect'
                              : ''
                          }
                          onClick={() => handleOptionClick(item.title, idx)}
                        >
                          {option.text}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {item.type === 'CONTENT_ONLY' && (
                  <p>{item.content}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No results.</p>
        )}

        {results.length > 0 && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'disabled' : ''}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={results.length < pageSize}
              className={results.length < pageSize ? 'disabled' : ''}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;