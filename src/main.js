/*
 * React.createClass() create a new component.
 * render() returns a tree of React components.
 * You do not have to return basic HTML.
 * You can return a tree of components that you (or someone else) built.
 */
var $ = require('jquery');
var marked = require('marked');
var Select2 = require('react-select2-wrapper');
var React = require('react');
var ReactDOM = require('react-dom');
var Babelify = require('babelify');
var Babel = require('babel-preset-react');
var FacebookLogin = require('react-facebook-login');
var ToggleDisplay = require('react-toggle-display');

var MealList = React.createClass({
  render: function() {
    var mealNodes = this.props.data.map(function(meal) {
      return (
        <Meal ingredients={meal.ingredients} key={meal.id}>
          {meal.disturbance}
        </Meal>
      );
    });
    return (
      <div className="MealList">
        {mealNodes}
      </div>
    );
  }
});
var Meal = React.createClass({
  render: function() {
    return (
      <div className="meal">
        <p className="mealIngredients">
          {this.props.ingredients}
        </p>
        {marked(this.props.children.toString())}
      </div>
    );
  }
});
var MealForm = React.createClass({
  getInitialState: function() {
    // Prefetching author from log in.
    return {ingredients: '', disturbance: ''};
  },
  handleDisturbanceChange: function(e) {
    this.setState({disturbance: e.target.value});
  },
  handleIngredientsChange: function(e) {
    this.setState({ingredients: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var ingredients = this.state.ingredients.trim();
    var disturbance = this.state.disturbance.trim();
    if (!ingredients) {
      return;
    }
    // TODO: send request to the server
    console.log(this.props);
    this.props.onMealSubmit({disturbance: disturbance, ingredients: ingredients});
    this.setState({disturbance: '', ingredients: ''});
  },
  render: function() {
    return (
      <form className="mealForm" onSubmit={this.handleSubmit}>
        <div className="ingridient">
            <Select2
                multiple
                options={
                    {
                        placeholder: 'Ingridients',
                        tags: true,
                        tokenSeparators: [',', ' ']
                    }
                }
                onChange={this.handleIngredientsChange}
            />
        </div>
        <span>Was the food disturbing?</span>
        <input 
            type="checkbox"
            name="food_disturbing"
            value="Yes"
            onChange={this.handleDisturbanceChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
var LoginButton = React.createClass({
    render: function() {
        if(this.props.show) {
            return <p>bio comp</p>
        } else {
            return null;
        }
    }
});
var MealBox = React.createClass({
  loadMealsFromServer: function() {
      console.log(this.state);
      $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleResponseFacebook: function(response) {
    if (typeof response.id != 'undefined') {
      this.setState({ fb_user_id: response.id});
      this.setState({ fb_user_name: response.name});
      this.setState({ showFacebookLogin: false});
    }
    else {
      this.setState({ showFacebookLogin: true});
    }
  },
  handleMealSubmit: function(meal) {
    var meals = this.state.data;
    // Optimistically set an id on the new meal. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    meal.id = Date.now();
    var newMeals = meals.concat([meal]);
    this.setState({data: newMeals});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: meal,
      success: function(data) {
        console.log(data);
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("errr");
        this.setState({data: meals});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  /**
   * getInitialState() executes exactly once during the lifecycle of 
   * the component and sets up the initial state of the component.
   */
  getInitialState: function() {
    return {data: [], showFacebookLogin: false};
  },
  /**
   * Here, componentDidMount is a method called automatically by React after 
   * a component is rendered for the first time.
   * The key to dynamic updates is the call to this.setState()
   */
  componentDidMount: function() {
    this.loadMealsFromServer();
  },
  render: function() {
    // Show either facebook login or user welcoming code.
    return (
      <div className="mealBox">
        <h1>Meals</h1>
          <MealList data={this.state.data} />
          <MealForm onMealSubmit={this.handleMealSubmit} />
           <ToggleDisplay show={this.state.showFacebookLogin}>
             <FacebookLogin
                appId="159840357540955"
                autoLoad={true}
                callback={this.handleResponseFacebook} />;
           </ToggleDisplay>
    </div>
    );
  }
});
ReactDOM.render(
  <MealBox url="http://drupal.dev/?q=test"/>,
  document.getElementById('content')
);
