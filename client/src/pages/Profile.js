import { useSelector } from 'react-redux';

import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div>
      <div>Welcome {user && user.name}</div>
      <div className="mt-3">{user && <FileUpload />}</div>
    </div>
  );
};

export default Profile;
