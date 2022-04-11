import { Editor } from "@tinymce/tinymce-react";

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from "tinymce/tinymce";

// Theme
import "tinymce/themes/silver";
// Toolbar icons
import "tinymce/icons/default";
// Editor styles
import "tinymce/skins/ui/oxide/skin.min.css";

// importing the plugin js.
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/charmap";
import "tinymce/plugins/hr";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/table";
import "tinymce/plugins/template";
import "tinymce/plugins/help";

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from "tinymce/skins/content/default/content.min.css";
import contentUiCss from "tinymce/skins/ui/oxide/content.min.css";

export default function TinyEditorComponent(props) {
  // note that skin and content_css is disabled to avoid the normal
  // loading process and is instead loaded as a string via content_style
  return (
    <Editor
      init={{
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        skin: false,
        content_css: false,
        content_style: [contentCss, contentUiCss].join("\n"),
      }}
    />
  );
}
