import React, { useContext, useState, useEffect } from 'react';
import { Form, ListGroup, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/authContext.jsx';
import { AppContext } from '../../context/context.jsx';
import { LoginModal } from '../global/loginRegisterModal.jsx';
import axios from 'axios';

export default function Comments({}) {
  const user = useContext(AuthContext);
  const { club } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!club._id) return;
    axios.get(`/bookclub/comment/${club._id}`).then((res) => {
      setComments(res.data);
    });
  }, [club]);

  const handleAddComment = () => {
    axios
      .post(`/bookclub/comment/${club._id}`, {
        //This should be changed to username once we start using usernames
        username: user.email,
        body: formData
      })
      .then(() => axios.get(`/bookclub/comment/${club._id}`))
      .then((res) => {
        setComments(res.data);
      });
  };

  const handleLike = (e) => {
    let newComments = [...comments];
    newComments.find((comment) => comment._id === e.target.id).likes++;
    setComments(newComments);
    axios.put(`/bookclub/comment/like/${e.target.id}`);
  };

  const handleDislike = (e) => {
    let newComments = [...comments];
    newComments.find((comment) => comment._id === e.target.id).dislikes++;
    setComments(newComments);
    axios.put(`/bookclub/comment/dislike/${e.target.id}`);
  };

  return (
    <div>
      <ListGroup>
        {comments.map((comment, idx) => (
          <ListGroup.Item key={idx}>
            <p>{comment.body}</p>
            <p>
              {comment.username} at{' '}
              <span>{Date(comment.created_at).toString()}</span>
            </p>
            <p>
              <Button id={comment._id} onClick={handleLike}>
                {comment.likes}
              </Button>
              {` likes | `}
              <Button id={comment._id} onClick={handleDislike}>
                {comment.dislikes}
              </Button>
              {` dislikes`}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {user ? (
        <Form>
          <Form.Group controlId='addComment'>
            <Form.Label>Add a Comment</Form.Label>
            <Form.Control
              type='textarea'
              placeholder='What are you thinking?'
              onChange={(e) => setFormData(e.target.value)}
            />
          </Form.Group>
          <Button variant='primary' onClick={handleAddComment}>
            Submit
          </Button>
        </Form>
      ) : (
        <Alert variant='info'>
          <Alert.Heading>Please log in to comment</Alert.Heading>
          <LoginModal />
        </Alert>
      )}
    </div>
  );
}
