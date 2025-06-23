import { LogOut } from '@deemlol/next-icons';
import { logout } from '../_lib/actions';


function SignOutButton() {
  return (
    <form action={logout}>
       <button className=''>
   
      <span>Sign Out</span>
    </button>
    </form>
   
  );
}

export default SignOutButton;