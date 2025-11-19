import { NextPage } from "next";

import { Button } from "@shared/ui/components/button";

interface HomeProps {}

const Home: NextPage<HomeProps> = () => {
  return (
    <div>
      <Button>Test Button</Button>
    </div>
  );
};

export default Home;
