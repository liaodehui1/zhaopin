import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html'; // 转为html
import htmlToDraft from 'html-to-draftjs'; // 转为字符串
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'; // 引入样式

export default class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props);
    const html = props.detail
    if (html) {
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
      };
    }else {
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  getContent = () => {
    // 返回对应的html格式文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
        onEditorStateChange={this.onEditorStateChange}
      />
    );
  }
}