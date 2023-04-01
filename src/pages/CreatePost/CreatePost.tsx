import { useEffect, useState } from "react"; // react-hooks

import { useQuill } from "react-quilljs"; // quill

import { useNavigate } from "react-router-dom";

import "quill/dist/quill.bubble.css"; // quill css file

// components

import "./createPost.css"; // styles

const CreatePost: React.FC<{}> = ({}) => {
  //--
  // variables ---
  const [postTitle, setPostTitle] = useState<string>(
    localStorage.getItem("post")
      ? JSON.parse(localStorage.getItem("post") ?? "").title
      : ""
  );
  const [postContent, setPostContent] = useState<string>(
    localStorage.getItem("post")
      ? JSON.parse(localStorage.getItem("post") ?? "").content
      : ""
  );

  let navigate = useNavigate(); // navigate var

  // quill rich text editor config ------------------------------

  const theme = "bubble";
  const placeholder = "Write what ever you want";
  const { quill, quillRef } = useQuill({ theme, placeholder });
  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = `${postContent}`;
      quill.on("text-change", () => {
        setPostContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  // submit the article date to the localstorage

  const submitArticle = async () => {
    let title = postTitle;
    let content = postContent;
    localStorage.setItem("post", JSON.stringify({ title, content }));
    navigate("/post/publish");
  };
  //jsx ---
  return (
    <div className="create-post">
      <input
        className="create-post-title"
        placeholder="Write a title"
        maxLength={80}
        value={postTitle}
        onChange={(e) => {
          setPostTitle(e.target.value);
        }}
      />
      <div className="create-post-content">
        <div ref={quillRef} />
      </div>
      <button className="submitArticle" onClick={submitArticle}>
        Submit Article
      </button>
    </div>
  );
};

export default CreatePost;
