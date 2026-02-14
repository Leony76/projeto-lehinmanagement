import { getDashboardStats } from "@/src/services/dashboard";
import Dashboard from "./Dashboard";
import { getRequiredSession } from "@/src/lib/get-session-user";
import LRC from '@/public/LericoriaPadraoFogo2.png';
import Link from "next/link";
import { buttonColorsScheme } from "@/src/constants/systemColorsPallet";
import Image from "next/image";

export default async function DashboardPage() {

  const user = (await getRequiredSession()).user;
  
  if (!user || !user.isActive) {
    return (
      <div className="flex flex-col justify-center max-h-[60dvh] items-center bg-zinc-700 max-w-270 rounded-3xl p-2 px-20">
        <Image 
          src={LRC} 
          alt={"LRC"}
          height={76}
          width={67}
        />
        <h1 className="text-red text-xl">
          Conta desativa
        </h1>
        <p>
          Nossos administradores apuraram circunstância que inferiram na desativação de sua conta por tempo indeterminado
        </p>
        <div>
          <label>
            Razão
          </label>
          <p className="text-gray">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, voluptates odio? Ut accusamus odio quibusdam quas iusto fugit corporis aspernatur ipsa ipsum, suscipit eum nesciunt similique iste explicabo itaque asperiores aliquid expedita quos. Sapiente eos reiciendis deleniti sit facere! Enim quis consequatur iure excepturi accusamus! Repellat iusto fuga, possimus cupiditate aut nihil, rem molestias, facilis eos sequi error. Accusantium expedita ea tempora totam accusamus, ipsa voluptas, inventore reprehenderit, excepturi dolore saepe illo mollitia. Iste eveniet, exercitationem similique officia veritatis deserunt sint atque. Error ipsam aspernatur dolore. Molestiae, neque. Ex temporibus cumque quidem alias itaque voluptate recusandae, dolor adipisci? Debitis, vitae?
          </p>
        </div>
        <Link className={buttonColorsScheme.red + ' text-center'} href={'/login'}>
          Voltar
        </Link>
      </div>
    )
  }

  const dashboardStats = await getDashboardStats();

  return (
    <Dashboard 
      dashboardStats={dashboardStats} 
    />
  );
} 