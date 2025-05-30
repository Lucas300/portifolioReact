import { useState, useContext, useEffect, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function FormPostagem() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [temas, setTemas] = useState<Tema[]>([]);
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: "" });
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem);
    const { id } = useParams<{ id: string }>();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    async function buscarPostagemPorId(id: string) {
        try {
            await buscar(`/postagens/${id}`, setPostagem, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.toString().includes("403")) {
                handleLogout();
            }
        }
    }

    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.toString().includes("403")) {
                handleLogout();
            }
        }
    }

    async function buscarTemas() {
        try {
            await buscar("/temas", setTemas, {
                headers: { Authorization: token },
            });
        } catch (error: any) {
            if (error.toString().includes("403")) {
                handleLogout();
            }
        }
    }

    useEffect(() => {
        if (token === "") {
            ToastAlerta("Você precisa estar logado", "info");
            navigate("/");
        }
    }, [token]);

    useEffect(() => {
        buscarTemas();

        if (id !== undefined) {
            buscarPostagemPorId(id);
        }
    }, [id]);

    useEffect(() => {
        setPostagem({
            ...postagem,
            tema: tema,
        });
    }, [tema]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate("/postagens");
    }

    async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                ToastAlerta("Postagem atualizada com sucesso", "sucesso");
            } catch (error: any) {
                if (error.toString().includes("403")) {
                    handleLogout();
                } else {
                    ToastAlerta("Erro ao atualizar a Postagem", "erro");
                }
            }
        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                ToastAlerta("Postagem cadastrada com sucesso", "sucesso");
            } catch (error: any) {
                if (error.toString().includes("403")) {
                    handleLogout();
                } else {
                    ToastAlerta("Erro ao cadastrar a Postagem", "erro");
                }
            }
        }

        setIsLoading(false);
        retornar();
    }

    const carregandoTema = tema.descricao === "";

    return (
        <div className="container flex flex-col mx-auto items-center mt-20  px-2. sm:px-1.5  lg:mt-1 md:px-8 " style={{
                    paddingRight:' 10 rem',
                    paddingLeft: '10 rem',
                }}>
            <form
                className="flex flex-col w-full max-w-4xl gap-6 p-6 px bg-slate-600 rounded-lg shadow-lg pt-10"
                style={{
                    transform: "scale(0.8)", // Reduz o tamanho do formulário em 20%
                    transformOrigin: "center", // Centraliza a escala
                    marginTop: "-3em",

                }}
                onSubmit={gerarNovaPostagem}
            >
                <h1 className="text-4xl font-bold text-center my-2 text-white ">
                    {id !== undefined ? "Editar Postagem" : "Nova Postagem"}
                </h1>

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo" className="text-lg font-semibold text-gray-200">
                        Título da Postagem
                    </label>
                    <input
                        type="text"
                        placeholder="Título"
                        name="titulo"
                        required
                        className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={postagem.titulo}
                        onChange={atualizarEstado}
                    />
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="texto" className="text-lg font-semibold text-gray-200">
                        Texto da Postagem
                    </label>
                    <textarea
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={postagem.texto}
                        onChange={atualizarEstado}
                    />
                </div>

                {/* Link da Imagem */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="imagem" className="text-lg font-semibold text-gray-200">
                        Link da Imagem
                    </label>
                    <input
                        type="text"
                        placeholder="URL da imagem"
                        name="imagem"
                        className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={postagem.imagem}
                        onChange={atualizarEstado}
                    />
                </div>

                {/* GitHub e LinkedIn na mesma linha */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="github" className="text-lg font-semibold text-gray-200">
                            Link do GitHub
                        </label>
                        <input
                            type="text"
                            placeholder="URL do GitHub"
                            name="github"
                            className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={postagem.github}
                            onChange={atualizarEstado}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="linkedin" className="text-lg font-semibold text-gray-200">
                            Link do LinkedIn
                        </label>
                        <input
                            type="text"
                            placeholder="URL do LinkedIn"
                            name="linkedin"
                            className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={postagem.linkedin}
                            onChange={atualizarEstado}
                        />
                    </div>
                </div>

                {/* Tema */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="tema" className="text-lg font-semibold text-gray-200">
                        Tema da Postagem
                    </label>
                    <select
                        name="tema"
                        id="tema"
                        className="border-2 border-gray-500 bg-slate-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
                    >
                        <option value="" selected disabled>
                            Selecione um Tema
                        </option>
                        {temas.map((tema) => (
                            <option key={tema.id} value={tema.id}>
                                {tema.descricao}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botão */}
                <button
                    type="submit"
                    className="rounded-lg bg-indigo-500 hover:bg-indigo-700 text-white font-bold w-full py-3 flex justify-center items-center transition duration-300"
                    disabled={carregandoTema}
                >
                    {isLoading ? (
                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        />
                    ) : (
                        <span>{id !== undefined ? "Atualizar" : "Cadastrar"}</span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;