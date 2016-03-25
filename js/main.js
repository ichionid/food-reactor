/*
 * React.createClass() create a new component.
 * render() returns a tree of React components.
 * You do not have to return basic HTML.
 * You can return a tree of components that you (or someone else) built.
 */
var data = [
  {id: 1, author: "Pete Hunt", text: "This is a comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {marked(this.props.children.toString())}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
          <CommentList data={this.props.data} />
          <CommentForm />
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
