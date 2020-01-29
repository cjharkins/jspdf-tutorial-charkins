import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import pdf from './utils/pdf'

function App() {
  const [searching, setSearching] = useState(false)
  const [movieList, setMovieList] = useState([])
  const [searchText, setSearchText] = useState('')

  const tmdbAPI = process.env.REACT_APP_TMDB_API_URL
  const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY

  const searchMovie = async text => {
    setSearching(true )
    try {
      const res = await fetch(`${tmdbAPI}/search/movie${tmdbApiKey}&query=${searchText}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })
      let response = await res.json()
      setMovieList(response.results)
    } catch (err) {
      console.log(err)
    } finally {
      setSearching(false )
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type='text'
          onChange={(e)=>{
            e.persist()
            // user types a title into the input
            setSearchText(e.target.value)
          }}
        />
        <button
          onClick={() => {
            // user clicks on search button
            searchMovie(searchText)
          }}
        >
          Search
        </button>
        <button
          onClick={() => {
            // Mind we are dynamically setting filename to be the
            // users movie input text, this can be anything you want.
            const filename = `Movies_relating_to_${searchText}.pdf`
            // All we want for this example are:
            // Title, Release Date, Description, Vote Average
            // This is important to the function we are building
            // because it sets the order in which we will display data
            const headers = [
              {key: 'title', display: 'Title'},
              {key: 'release_date', display: 'Release'},
              {key: 'overview', display: 'Overview'},
              {key: 'vote_average', display: 'Vote Average'},
            ]

            // Here's the call for our pdf function
            // Because of the placeholder code in our pdf.js file,
            // clicking on this should render a save dialog
            // and downloading should render an empty pdf
            pdf({data: movieList,headers,filename})
          }}
        >
          Download PDF
        </button>
        {
          // We will be proofing our data here by displaying the list
          // of titles associated with our search.
          // This isn't really necessary, however, I wanted to ensure
          // that we had data and I am able to cross reference its accuracy.
          // You can use this searching flag to render a loading icon if you'd like
          !searching &&
          movieList.map((movie,index) => <div key={index}>{movie.title}</div>)
        }
      </header>
    </div>
  );
}

export default App;
