import React, { useState, useEffect } from "react";
import "./Movie.css";
import MovieCard from "./MovieCard";

const API_URL = "http://www.omdbapi.com?apikey=b169cf0";
const RESULTS_PER_PAGE = 10;

function MovieFile() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const searchMovies = async (title, page) => {
        setLoading(true);
        const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
        const data = await response.json();

        if (data.Response === "True") {
            setMovies(data.Search);
            setTotalResults(parseInt(data.totalResults));
        } else {
            setMovies([]);
            setTotalResults(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (searchTerm.trim() === "") {
            searchMovies("Batman", currentPage);
        } else {
            searchMovies(searchTerm, currentPage);
        }
    }, [currentPage, searchTerm]);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
        const pages = Array.from(
            { length: Math.min(totalPages, 10) },
            (_, index) => index + 1
        );

        return (
            <div className="pagination">
                <button
                    className="prev_button"
                    onClick={() =>
                        handlePageClick(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {pages.map((page) => (
                    <button
                        className={`count_pagination ${
                            currentPage === page ? "selected" : ""
                        }`}
                        key={page}
                        onClick={() => handlePageClick(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="next_button"
                    onClick={() =>
                        handlePageClick(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <>
            <div className="app">
                <h1>Movie Search</h1>

                <div className="search">
                    <input
                        placeholder="Search for movies"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>
                        <div className="container">
                            {movies?.map((movie) => (
                                <MovieCard key={movie.imdbID} movie={movie} />
                            ))}
                        </div>
                        {totalResults > RESULTS_PER_PAGE && renderPagination()}
                    </>
                )}
            </div>
        </>
    );
}

export default MovieFile;
