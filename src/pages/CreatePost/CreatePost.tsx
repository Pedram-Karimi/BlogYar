import { useEffect, useState } from "react"; // react-hooks

import { useQuill } from "react-quilljs"; // quill

import "quill/dist/quill.bubble.css"; // quill css file

// components

import NavBar from "../../components/NavBar/NavBar";

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

  //jsx ---
  return (
    <>
      <NavBar
        postTitle={postTitle}
        createPost={true}
        postContent={postContent}
      />
      <div className="create-post">
        <input
          className="create-post-title"
          placeholder="Write a title"
          maxLength={60}
          value={postTitle}
          onChange={(e) => {
            setPostTitle(e.target.value);
          }}
        />
        <div className="create-post-content">
          <div ref={quillRef} />
        </div>
      </div>
    </>
  );
};

export default CreatePost;
