import SignUpForm from "../components/SignUp";

export default async function SignUpFormLayout() {
  return (
    <div className="flex flex-1 flex-col w-full h-full z-20 mt-[170px]">
      <SignUpForm />
    </div>
  );
}
