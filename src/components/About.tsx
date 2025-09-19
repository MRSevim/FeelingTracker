import Link from "next/link";

const About = () => {
  return (
    <div className="mt-15">
      <h1 className="text-2xl font-bold ">About</h1>
      <p className="mt-2">
        This website is a nice tool for users to track their day to day mood and
        see how it changes over time. I needed something to track my mood so I
        developed it. However, anyone can create an account and start tracking
        their mood. So feel free to do so and and let me know what you think!
      </p>
      <h2 className="mt-2 text-xl font-bold">About Me</h2>
      <p className="mt-2">
        {" "}
        My name is Muhammed Raşid Sevim and I am from Turkey. I developed the
        website myself and I developed it with Nextjs. This is not meant to be
        fully functional web app but is just a fun little project that some
        people might find useful. However, I am open to suggestions on how to
        make it nicer and might implement more stuff to the thing in the future.
        If you are curious about other things I built, check my portfolio{" "}
        <Link
          href={"https://mrsevim.github.io/Portfolio/"}
          className="hover:underline"
        >
          here
        </Link>
        .
      </p>
    </div>
  );
};

export default About;
