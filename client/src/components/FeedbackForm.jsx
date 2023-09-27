import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button, Input, Spacer, Textarea,
} from "@nextui-org/react";

import { sendFeedback } from "../actions/user";
import Container from "./Container";
import Row from "./Row";
import Text from "./Text";

function FeedbackForm(props) {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");

  const { sendFeedback, user } = props;

  const _onSendFeedback = () => {
    setLoading(true);
    setSuccess(false);
    setSubmitError(false);
    sendFeedback({
      name,
      feedback,
      email: user.email,
    })
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setSubmitError(true);
      });
  };

  return (
    <Container>
      <Row>
        <Text size="h4">{"Feedback & Suggestions"}</Text>
      </Row>
      <Spacer y={1} />
      <Row>
        <Text>We would appreciate any feedback you may have</Text>
      </Row>
      <Spacer y={1} />
      <Row>
        <Input
          onChange={(e) => setName(e.target.value)}
          name="name"
          label="Your name"
          placeholder="Can be anonymous"
          fullWidth
          variant="bordered"
        />
      </Row>
      <Spacer y={1} />
      <Row>
        <Textarea
          onChange={(e) => setFeedback(e.target.value)}
          name="feedback"
          label="Your Comments"
          placeholder="Tell us about your exprience with our product"
          fullWidth
          variant="bordered"
        />
      </Row>
      {(success || submitError) && <Spacer y={0.5} />}
      <Row>
        {success
            && <Text color="success">{"We received your feedback and will work on it! Thank you."}</Text>}
        {submitError
            && <Text color="danger">{"Something went wront, please try again or email us directly on support@chartbrew.com"}</Text>}
      </Row>
      <Spacer y={1} />
      <Row>
        <Button
          disabled={!feedback}
          onClick={() => _onSendFeedback()}
          color="primary"
          isLoading={loading}
        >
          Send feedback
        </Button>
      </Row>
    </Container>
  );
}

FeedbackForm.propTypes = {
  sendFeedback: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    sendFeedback: (data) => dispatch(sendFeedback(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackForm);
