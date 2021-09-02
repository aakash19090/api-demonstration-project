import React, { useState } from "react";
import Downloader from '../components/userDashboard/Downloader'
import { v4 as uuid } from "uuid";

const useFileDownloader = () => {
  const [files, setFiles] = useState(() => []);

  const download = (file,id) =>{
    setFiles((fileList) => [...fileList, { ...file, downloadId: uuid() }]);
  }

  const remove = (removeId) =>{
    setFiles((files) => [
      ...files.filter((file) => file.downloadId !== removeId),
    ]);
  }
   

  return [
    (e) => download(e),
    files.length > 0 ? (
      <Downloader files={files} remove={(e) => remove(e)} />
    ) : null,
  ];
};

export default useFileDownloader;
