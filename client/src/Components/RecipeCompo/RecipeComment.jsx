import React from "react";
import { RiChat3Line } from "react-icons/ri";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CommentForm = ({ onSubmit, recipeId }) => {
  const [comment, setComment] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit(comment, recipeId);
    setComment("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="comment-form bg-white shadow-md rounded-md p-4 flex items-center"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="w-full resize-none focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-full p-2 ml-2 focus:outline-none hover:bg-blue-600 transition-colors duration-300"
      >
        <RiChat3Line />
      </button>
    </motion.form>
  );
};

const CommentList = ({ comments }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="comment-list mt-4"
    >
      {comments.map((comment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="comment bg-gray-100 p-3 rounded-md shadow-md flex items-center my-3"
        >
          <img
            src={comment.image}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{comment.username}</h3>
            <p className="text-gray-700">{comment.text}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Comment = ({ recipeId, recipeComments }) => {
  const handleCommentSubmit = async (comment) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userData"));
      const userId = userInfo.userData._id;
      const response = await fetch(
        `http://localhost:4000/recipe/comment/${recipeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            comment,
            image: userInfo.userData.image,
            username: userInfo.userData.username,
          }),
        }
      );
      if (response.ok) {
        Swal.fire({
            title: "Success",
            text: "Comment added successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload()
            }
          });
      } else {
      }
    } catch (error) {
    }
  };

  return (
    <div className="container mx-auto space-y-3">
      <h2 className="text-2xl text-white font-semibold my-4">Comments</h2>
      <CommentForm onSubmit={handleCommentSubmit} recipeId={recipeId} />
      <div className="w-full h-[470px] overflow-y-scroll p-3 rounded-sm">
        {Array.isArray(recipeComments) && recipeComments.length > 0 ? (
          <CommentList comments={recipeComments} />
        ) : (
          <p>No comments available</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
