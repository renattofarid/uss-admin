import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/AuthContext";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Landing() {
  const { login, isLoading } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({
    email: 'admin@uss.com',
    password: 'password',
  });
  const navigate = useNavigate();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValues.email === '' || formValues.password === '') {
      return alert('Llene todos los campos');
    }
    try {
      const user = await login(formValues);
      if (user) {
        toast.success('Bienvenido');
        navigate('/');
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (error) {
      console.log(error)
      toast.error('Ocurrió un error inesperado, intente nuevamente');
    }
  };
  return (

    <div className="flex flex-col items-center justify-center"
      style={{
        height: "calc(100vh - 80px)"
      }}>
      <main className="flex flex-col items-center justify-center h-full px-1 text-center">
        <h1 className="text-xl md:text-6xl font-bold">
          USS
          <p className="text-green-600 text-4xl font-bold">
            ADMIN
          </p>
        </h1>

        <p className="mt-3 text-sm text-green-500 font-extrabold">
          INGRESE SUS CREDENCIALES
        </p>

        <div>
          <div className="flex flex-col justify-center">
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleOnSubmit}>
                <div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Usuario</Label>
                    <Input id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formValues.email}
                      disabled={isLoading}
                      onChange={handleOnChange} />
                  </div>
                </div>

                <div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formValues.password}
                      disabled={isLoading}
                      onChange={handleOnChange} />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    size={"sm"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-full flex justify-center">
                        <div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500'></div>
                      </div>
                    ) : 'LOGIN'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing