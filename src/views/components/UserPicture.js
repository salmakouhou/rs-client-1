import React from "react";
import { Buffer } from 'buffer'

/*

*/
const UserPicture = ({ user, size, badge }) => {
  const toBase64 = (input) => {
    return Buffer.from(input, 'utf-8').toString('base64')
  }
  const test = () => {
    console.log(user.profilePicture)
  }
  test()
  return (
    <div className="col-auto">
      {user.profilePicture != null && (
        <div>
          <span
            className={`avatar avatar-${size}`}
            style={{
              backgroundImage: `url(data:${user.profilePicture.mimetype};base64,${toBase64(user.profilePicture.data)})`,
            }}
          >
            {badge && <span className="badge bg-green"></span>}
          </span>
        </div>
      )}
      {user.profilePicture == null && (
        <span className={`bg-blue-lt avatar avatar-${size}`}>
          {user.firstName ? user.firstName[0] : ""}
          {user.lastName ? user.lastName[0] : ""}
        </span>
      )}
    </div>
  );
};

export default UserPicture;
