import React, { useEffect, useRef, useState } from "react";
import { Line, Circle } from 'rc-progress';
import Axios, {CancelToken, isCancel} from "axios";

const Downloader = ({ files = [], remove }) => {
  return (
    <div className="downloader">
      <div className="card">
        <div className="card-header">Downloads</div>
        <ul className="list-group list-group-flush">
          {files.map((file, idx) => (
            <DownloadItem
              key={file.downloadId}
              removeFile={() => remove(file.downloadId)}
              filename={file.name}
              {...file}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const DownloadItem = ({ name, file, filename, removeFile, downloadId}) => {
  const [downloadInfo, setDownloadInfo] = useState({
    progress: 0,
    completed: false,
    total: 0,
    loaded: 0,
  });

  const cancelFileDownload = useRef(null)

  useEffect(() => {
    const options = {
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;

        setDownloadInfo({
          progress: Math.floor((loaded * 100) / total),
          loaded,
          total,
          completed: false,
        });
      },
      cancelToken: new CancelToken( cancel => cancelFileDownload.current = cancel)
    };

    Axios.get(file, {
      responseType: "blob",
      ...options,
    }).then(function (response) {

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: response.headers["content-type"],
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      setDownloadInfo((info) => ({
        ...info,
        completed: true,
      }));

      setTimeout(() => {
        removeFile();
      }, 4000);
    })
    .catch(error => {
      if (isCancel(error)) {
        removeFile();
    }
    });
  }, []);

  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const cancelDownload = () => {
    if(cancelFileDownload.current){
      cancelFileDownload.current("user has cancled file download")
    }
  }

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-12 d-flex">
          <div className="d-inline font-weight-bold text-truncate">{name}</div>
          <div className="d-inline ml-2">
            <small>
              {downloadInfo.loaded > 0 && (
                <>
                  <span className="text-success">
                    {formatBytes(downloadInfo.loaded)}
                  </span>
                  / {formatBytes(downloadInfo.total)}
                </>
              )}

              {downloadInfo.loaded === 0 && <>Initializing...</>}
            </small>
          </div>
          <div className="d-inline ml-2 ml-auto">
            {downloadInfo.completed && (
              <span className="text-success">
                Completed
              </span>
            )}
          </div>
        </div>
        <div className="col-12 mt-2 progress-bar-wrapper">
        <span className="bar">
        <div className="progress-line">
        <Line
            percent={downloadInfo.progress}
            strokeWidth="2"
            strokeColor="#000000"
          />
        </div>
        </span>
        <span className="cancel-download" onClick={()=>cancelDownload()}>
          <svg xmlns="http://www.w3.org/2000/svg" height={24} viewBox="0 0 24 24" width={24}>
              <path className="close-svg" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg> 
          </span>
        </div>
      </div>
    </li>
  );
};

export default Downloader;
