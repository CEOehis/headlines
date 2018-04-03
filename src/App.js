import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, Button, Input, Form, FormGroup } from 'reactstrap';
import './App.css';
import { countries } from './utils/countries';
import { sources } from './utils/sources';

const PATH_BASE = 'https://newsapi.org/v2/';
const PARAM_TOP = 'top-headlines?';
const PATH_API = 'apiKey=d371786357714d1db3a78f9fda001e81';

class App extends Component {
  constructor() {
    super();
    this.state = {
      articles: [],
      country: 'us',
      sources: sources,
      searchSourceInput: ''
    }

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.fetchCountryStories = this.fetchCountryStories.bind(this);
    this.openNewsLink = this.openNewsLink.bind(this);
    this.onSearchSourceChange = this.onSearchSourceChange.bind(this);
    this.fetchSourceStories = this.fetchSourceStories.bind(this);
  }

  componentDidMount() {
    this.fetchCountryStories(this.state.country);
    this.fetchSources();
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

  fetchSourceStories(source) {
    const queryUrl = `${PATH_BASE}${PARAM_TOP}sources=${source}&${PATH_API}`;
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

  openNewsLink(url) {
    console.log(url);
    window.open(url);
  }

  fetchSources() {
    const sourcesUrl = 'https://newsapi.org/v2/sources?apiKey=d371786357714d1db3a78f9fda001e81'
    fetch(sourcesUrl)
      .then(res => res.json())
      .then(res => {
        this.setState({
          sources: res.sources
        })
      })
  }

  onSearchSourceChange(event) {
    let { sources, searchSourceInput } = this.state;
    searchSourceInput = event.target.value;
    this.setState({
      searchSourceInput
    });
  }

  render() {
    const { articles, country, sources, searchSourceInput } = this.state;
    return (
      <div className="container-fluid">
        <header className="">
          <h1 className="text-center">Headlines</h1>
        </header>
        <section className="app row">
          <section className="col-md-2">
            <div className="sidebar">
            <Form>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input value={searchSourceInput} onChange={this.onSearchSourceChange} type="text" name="search" id="search" placeholder="search sources" />
              </FormGroup>
            </Form>
            <h6>Select News source</h6>
            <ul style={{maxHeight: '500px', overflowY: 'scroll', width: '100%', paddingLeft: '0'}}>
              {sources.filter(source => source.name.toLowerCase().includes(searchSourceInput.toLowerCase())).map(source => 
                <li onClick={() => this.fetchSourceStories(source.id)} style={{cursor: 'pointer'}} key={source.id}>{source.name}</li>
              )}
            </ul>
            </div>
          </section>
          <section className="main col-md-10">
            <nav>
              <select className="form-control" value={country} onChange={this.handleCountryChange}>
              {countries.map(country =>
                <option key={country.code} value={country.code.toLowerCase()}>{country.name}</option>
              )}
              </select>
            </nav>
            <main className="container-fluid">
              <div className="row">
                {articles.map(article =>
                  <div key={article.url} style={{marginBottom: '20px'}} className="col-md-4">
                    <Card style={{cursor: 'pointer'}} onClick={() => this.openNewsLink(article.url)}>
                      <CardImg style={{height: '160px' }} top width="100%" src={article.urlToImage} />
                      <CardBody>
                        <CardTitle>{article.title}</CardTitle>
                        <CardText>{article.description}</CardText>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </div>
            </main>
          </section>
        </section>
      </div>
    );
  }
}

export default App;
