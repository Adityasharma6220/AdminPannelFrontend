// CKEditorComponent.js
import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button } from '@mui/material';
import axios from 'axios';
import { BackendURL } from 'store/constant';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router';
const MyCKEditor = ({ slug }) => {
  const navigate = useNavigate();
  const [editor, setEditor] = useState(null);
  const [editorData, setEditorData] = useState('Default data'); // Set a default value

  useEffect(() => {
    // fetchData(); // Remove this from here
  }, [slug]);

  const fetchData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };

      const response = await axios.post(`${BackendURL}static-page/getStaticPage`, { slug: slug }, { headers: headers });
      
      setEditorData(response.data.data.body);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching data:', error);
      // Handle error, maybe set an error state for user feedback
    }
  };

  const handleEditorReady = (editor) => {
    setEditor(editor);
    fetchData(); // Move fetchData here
  };

  const handleEditorChange = (event, editor) => {
    const updatedData = editor.getData();
    setEditorData(updatedData);
  };

  const handleSave = async () => {
    
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };

    const response = await axios.post(
      `${BackendURL}static-page/updateStaticPageDetails`,
      { slug: slug, body: editorData },
      { headers: headers }
    );
    if (response.data.status) {
      let message = '';
      slug === 'terms-condition' ? (message = 'Terms & Condition page updated !') : (message = 'Privacy & Policies page updated !');
      toast.success(message);
    }
  };

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorChange}
        onReady={handleEditorReady}
        config={{
          autoGrow: true,
          minHeight: '400px'
        }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default MyCKEditor;
