import React from "react";
import { useState } from "react"
import { useDispatchTyped, useSelectorTyped } from "../../store/helperHooks";
import { Alert, Button, Form } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import Spinner from "../UI/Spinner/Spinner";
import { AuthActions } from "../../store/authActions";

export interface LoginFormProps {

}

const LoginForm = (props: LoginFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const serverErrors = useSelectorTyped(state=>state.auth?.error)

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

    const dispatch = useDispatchTyped();
    const onSubmit = async (event: React.FormEvent)=>{
        event.preventDefault()
        setIsLoading(true)
        await dispatch(AuthActions.login(username, pass))
        setIsLoading(false)
    }

    return (
        <>
            <Card style={{
                width: "60%", 
                margin: "auto", 
                marginTop: "5%",
                padding: "20px"}}>
                <Card.Body>
                    {(serverErrors ? (
                        <Alert variant="danger">
                            {serverErrors}
                        </Alert>
                    ) : null)}
                    <Form onSubmit={onSubmit}>
                        <FloatingLabel
                                controlId="floatingInput"
                                label="Nazwa użytkownika"
                                className="mb-3">
                            <Form.Control required 
                                          name="email" 
                                          type="text" 
                                          placeholder="Nazwa użytkownika" 
                                          value={username}
                                          onChange={e=>setUsername(e.target.value)}/>
                        </FloatingLabel>
                        <FloatingLabel 
                                controlId="floatingPassword" 
                                label="Hasło"
                                className="mb-3">
                            <Form.Control 
                                        required 
                                        name="pass" 
                                        type="password" 
                                        placeholder="Hasło"
                                        value={pass}
                                        onChange={e=>setPass(e.target.value)} />
                        </FloatingLabel>
                        <Button type="submit" className="mb-3">Zaloguj</Button>
                    </Form>  
                    {isLoading ? <Spinner /> : null}
                </Card.Body>
            </Card>
        </>
    )
    // const [isLoading, setIsLoading] = useState(false);
    // const serverErrors = useSelectorTyped(state=>state.auth?.error)
    // const redirectPath = useSelectorTyped(state=>state.auth?.redirectPath)

    // const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    //     resolver: yupResolver(schema)
    // });
    // const dispatch = useDispatch();
    // const onSubmit = async (data:FormData)=>{
    //     setIsLoading(true)
    //     await dispatch(AuthActions.login(data.email, data.password))
    //     setIsLoading(false)
    // }

    // console.log(errors);
    // return (
    //     <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
    //         <TextInput name="email" register={register}  label="Email" placeholder="Enter email" errors={errors} /> 
    //         <TextInput name="password" register={register}  label="Password" placeholder="Enter password" errors={errors} password /> 

    //         <button type="submit" className={style.submitBtn}>Login</button>
    //         {serverErrors ? <h5 style={{color:'red'}}>{serverErrors}</h5> : null}
    //         {isLoading? <Spinner /> :null}
    //     </form>
    // ) 
}

export default LoginForm;