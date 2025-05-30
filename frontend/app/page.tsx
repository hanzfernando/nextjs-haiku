import SignupForm from "@/components/SignupForm";
import { getUserFromCookie } from "@/lib/getUser";

export default async function Home() {
  const user = await getUserFromCookie();
  console.log("User from cookie:", user);
  return (
    <>
      {!user && (     
            <SignupForm />     
        )
      }
      {user && (
        <div className="py-12">
          <p className="text-center text-2xl text-gray-600 mb-5">Welcome back, <strong>{user.username}</strong>!</p>
        </div>
      )}
    </>
  );
}
