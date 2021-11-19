import { Component } from "react";
import Loader from "react-loader-spinner";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  inProgress: "IN_PROGRESS",
  failure: "FAILURE",
};

class UsersList extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userData: [],
    userInput: "",
    message: "",
    count: 0,
  };

  componentDidMount() {
    this.getQuetions();
  }

  getQuetions = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });
    const response = await fetch("https://jservice.io/api/random");
    if (response.ok === true) {
      const retrivedData = await response.json();
      console.log(retrivedData);
      const formattedData = retrivedData.map((eachItem) => ({
        id: eachItem.category_id,
        question: eachItem.question,
        answer: eachItem.answer,
      }));
      this.setState({
        userData: formattedData,
        apiStatus: apiStatusConstants.success,
      });
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  changeQuestion = () => {
    const { userInput } = this.state;
    const userAnswer = JSON.parse(localStorage.getItem("answer"));
    if (userAnswer.toLowerCase() === userInput.toLowerCase()) {
      this.setState({
        message: "Correct Answer ,Your next Question is Ready...",
        userInput: "",
      });
      this.setState((prev) => ({
        count: prev.count + 1,
      }));
    } else {
      this.setState({ message: "Wrong Answer", userInput: "" });
    }
    this.getQuetions();
  };

  onChangeAnswer = (event) => {
    this.setState({
      userInput: event.target.value,
    });
  };

  renderQuestionList = () => {
    const { userData, userInput, message, count } = this.state;
    if (userData.length > 0) {
      localStorage.setItem("answer", JSON.stringify(userData[0].answer));
    }
    return (
      <div className="quiz-container">
        <div className="main-con">
          <div className="nav-con">
            <h1 className="main-heading">Quiz</h1>
            <h1 className="score">Score:{count}</h1>
          </div>
          <div className="body-con">
            <h1 className="question">{userData[0].question}</h1>
            <p className="answer">
              Type Your Answer:{" "}
              <input
                type="text"
                onChange={this.onChangeAnswer}
                value={userInput}
              />
            </p>

            <button
              type="button"
              onClick={this.changeQuestion}
              className="button"
            >
              {" "}
              submit
            </button>
            <p className="message">{message}</p>
          </div>
        </div>
      </div>
    );
  };

  renderFailureView = () => <h1>Please retry</h1>;

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  );

  render() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderQuestionList();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  }
}

export default UsersList;
