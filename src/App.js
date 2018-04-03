import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, Button } from 'reactstrap';
import './App.css';
import { countries } from './utils/countries';

const PATH_BASE = 'https://newsapi.org/v2/';
const PARAM_TOP = 'top-headlines?';
const PATH_API = 'apiKey=d371786357714d1db3a78f9fda001e81';

class App extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      country: 'us'
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.fetchCountryStories = this.fetchCountryStories.bind(this);
  }

  componentDidMount() {
    this.fetchCountryStories(this.state.country)
  }
  
  fetchCountryStories(countryCode) {
    const queryUrl = `${PATH_BASE}${PARAM_TOP}country=${countryCode}&${PATH_API}`;
    console.log(queryUrl);
    fetch(queryUrl)
      .then(res => res.json())
      .then(res => {
        console.log(res.articles);
        this.setState({
          articles: res.articles
        });
      });    
  }

  handleCountryChange(event) {
    console.log(event.target.value);
    this.setState({
      country: event.target.value
    });
    this.fetchCountryStories(event.target.value);
  }

  render() {
    const { articles, country } = this.state;
    return (
      <div className="">
        <header className="">
          <h1 className="text-center">Headlines</h1>
        </header>
        <nav>
          <select value={country} onChange={this.handleCountryChange}>
          {countries.map(country =>
            <option key={country.code} value={country.code.toLowerCase()}>{country.name}</option>
          )}
          </select>
        </nav>
        <main className="container-fluid">
          <div className="row">
            {articles.map(article =>
              <div key={article.url} style={{marginBottom: '20px'}} className="col-md-4">
                <Card>
                  <CardImg style={{height: '265px' }} top width="100%" src={article.urlToImage} />
                  <CardBody>
                    <CardTitle>{article.title}</CardTitle>
                    <CardText>{article.description}</CardText>
                    <Button>Button</Button>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
