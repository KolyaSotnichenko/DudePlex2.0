import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FunctionComponent, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiLockPasswordLine } from "react-icons/ri";
import * as Yup from "yup";
import { auth, db } from "../../shared/firebase";
import { convertErrorCodeToMessage, getRandomAvatar } from "../../shared/utils";
import { useAppSelector } from "../../store/hooks";
import ModalNotification from "./ModalNotification";
import { signInWithProvider } from "./signInWithProvider";
interface SignUpProps {
  setIsSignIn: any;
  isSignIn: boolean;
}

const SignUp: FunctionComponent<SignUpProps> = ({ setIsSignIn, isSignIn }) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signUpHandler = async (values: { [key: string]: string }) => {
    try {
      setIsLoading(true);
      const user = (
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        )
      ).user;

      setDoc(doc(db, "users", user.uid), {
        firstName: values.firstName,
        lastName: values.lastName,
        photoUrl: getRandomAvatar(),
        bookmarks: [],
        recentlyWatch: [],
      });
    } catch (error: any) {
      setError(convertErrorCodeToMessage(error.code));
    }

    setIsLoading(false);
  };

  return (
    <>
      {currentUser && (
        <ModalNotification type="success" message={"Зареєструйтеся успішно"} />
      )}
      {isLoading && (
        <div className="z-10 tw-flex-center h-screen relative">
          <div className="w-28 h-28 border-[10px] rounded-full border-primary border-t-transparent animate-spin "></div>
        </div>
      )}
      {error && (
        <ModalNotification type="error" message={error} setError={setError} />
      )}
      <div className="px-4 py-2 rounded-xl max-w-xl w-full min-h-[500px] text-white/70 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center mb-5">
          <div className="text-[50px] font-semibold mb-1 mx-auto text-center md:text-left">
            <div className="uppercase tracking-wider text-xl font-medium mb-2">
            Почніть безкоштовно
            </div>
            <div className="text-primary leading-none mb-4 ">
              Create Account
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() =>
                signInWithProvider(new GoogleAuthProvider(), "google")
              }
              className="h-12 w-12 rounded-full bg-white tw-flex-center hover:brightness-75 transition duration-300"
            >
              <FcGoogle size={25} className="text-primary" />
            </button>
            <button
              onClick={() =>
                signInWithProvider(new FacebookAuthProvider(), "facebook")
              }
              className="h-12 w-12 rounded-full bg-white tw-flex-center hover:brightness-75 transition duration-300"
            >
              <FaFacebookF size={25} className="text-primary" />
            </button>
          </div>
          <p className="text-lg">або скористайтеся обліковим записом електронної пошти: </p>
        </div>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, "Має бути 15 символів або менше")
              .required("Вимагається"),
            lastName: Yup.string()
              .max(20, "Має бути 20 символів або менше")
              .required("Вимагається"),
            email: Yup.string()
              .email("Невірна адреса електронної пошти")
              .required("Вимагається"),
            password: Yup.string()
              .required("Пароль не надано.")
              .min(6, "Пароль надто короткий - має містити мінімум 6 символів."),
          })}
          onSubmit={signUpHandler}
        >
          <Form>
            <div className="flex md:justify-between gap-8 md:gap-0 mb-6">
              <div className="relative">
                <Field
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  className="w-full bg-dark-lighten px-5 py-4 pr-12 rounded-xl outline-none peer text-white"
                />
                <label
                  htmlFor="firstName"
                  className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
                >
                  Ім'я
                </label>
                <CgProfile
                  size={25}
                  className="absolute top-1/2 -translate-y-1/2 right-4"
                />
                <p className="absolute top-[95%] left-[3%] text-red-600">
                  <ErrorMessage name="firstName" />
                </p>
              </div>

              <div className="relative">
                <Field
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  className="w-full bg-dark-lighten px-5 py-4 pr-12 rounded-xl outline-none peer text-white"
                />
                <label
                  htmlFor="lastName"
                  className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
                >
                  Прізвище
                </label>
                <CgProfile
                  size={25}
                  className="absolute top-1/2 -translate-y-1/2 right-4"
                />
                <p className="absolute top-[95%] left-[3%] text-red-600">
                  <ErrorMessage name="lastName" />
                </p>
              </div>
            </div>
            <div className="relative mb-6">
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full bg-dark-lighten px-5 py-4 pr-12 rounded-xl outline-none peer text-white"
              />
              <label
                htmlFor="email"
                className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
              >
                Email
              </label>
              <AiOutlineMail
                size={25}
                className="absolute top-1/2 -translate-y-1/2 right-4"
              />
              <p className="absolute top-[95%] left-[3%] text-red-600">
                <ErrorMessage name="email" />
              </p>
            </div>
            <div className="relative mb-12">
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full bg-dark-lighten px-5 py-4 pr-12 rounded-xl outline-none peer text-white"
              />
              <label
                htmlFor="password"
                className={`absolute left-5 text-gray-400 transition duration-500 pointer-events-none 
                translate-y-[-50%] visible peer-placeholder-shown:opacity-0 peer-placeholder-shown:invisible peer-placeholder-shown:translate-y-[-10%] ease-in-out
                `}
              >
                Пароль
              </label>
              <RiLockPasswordLine
                size={25}
                className="absolute top-1/2 -translate-y-1/2 right-4"
              />
              <p className="absolute top-[95%] left-[3%] text-red-600">
                <ErrorMessage name="password" />
              </p>
            </div>
            <button
              type="submit"
              className="px-12 py-3 bg-primary rounded-full text-lg text-white uppercase absolute left-1/2 -translate-x-1/2 hover:bg-[#4161cc] transition duration-300"
            >
              Зареєструватися
            </button>
          </Form>
        </Formik>
        <p className="text-xl flex gap-2 mt-32 justify-center">
          <span>Вже учасник?</span>
          <button
            type="submit"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-primary/90 underline"
          >
            Увійти
          </button>
        </p>
      </div>
    </>
  );
};

export default SignUp;
