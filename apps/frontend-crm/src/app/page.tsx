import { NextPage } from "next"
import { formatWelcome } from "@workspace/feature-auth/frontend"
import type { AuthUser } from "@workspace/feature-auth/shared"
import { Button } from "@shared/ui/components/button"

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
  const user: AuthUser = { id: "1", name: "Alice" }
  const message = formatWelcome(user)
  return (
    <div>
      <h1>{message}</h1>
      <Button>Test Button</Button>
    </div>
  );
};

export default Home;
