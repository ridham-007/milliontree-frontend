import LoginForm from "../components/Login";

export default async function LoginFormLayout() {
  return (
    <div className="flex flex-1 flex-col w-full h-full z-10 mt-[230px]">
      <LoginForm />
    </div>
  );
}