import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/context/ProgressContext";
import BadgeToast from "@/components/BadgeToast";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import LampIntro from "@/components/LampIntro";
import GradeSelect from "@/components/GradeSelect";
import Home from "@/pages/Home";
import GradePage from "@/pages/GradePage";
import QuizPage from "@/pages/QuizPage";
import GamePage from "@/pages/GamePage";
import AchievementsPage from "@/pages/AchievementsPage";
import LessonsPage from "@/pages/LessonsPage";
import TrueFalsePage from "@/pages/TrueFalsePage";
import PersonalityGamePage from "@/pages/PersonalityGamePage";
import CompletionPage from "@/pages/CompletionPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const fadeUp = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: -20, scale: 0.97 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

function Router() {
  return (
    <>
      <Navbar />
      <BadgeToast />
      <div className="pb-20 sm:pb-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/grade/4">{() => <GradePage gradeId={4} />}</Route>
          <Route path="/grade/5">{() => <GradePage gradeId={5} />}</Route>
          <Route path="/grade/6">{() => <GradePage gradeId={6} />}</Route>
          <Route path="/quiz/4">{() => <QuizPage gradeId={4} />}</Route>
          <Route path="/quiz/5">{() => <QuizPage gradeId={5} />}</Route>
          <Route path="/quiz/6">{() => <QuizPage gradeId={6} />}</Route>
          <Route path="/game/4">{() => <GamePage gradeId={4} />}</Route>
          <Route path="/game/5">{() => <GamePage gradeId={5} />}</Route>
          <Route path="/game/6">{() => <GamePage gradeId={6} />}</Route>
          <Route path="/truefalse/4">
            {() => <TrueFalsePage gradeId={4} />}
          </Route>
          <Route path="/truefalse/5">
            {() => <TrueFalsePage gradeId={5} />}
          </Route>
          <Route path="/truefalse/6">
            {() => <TrueFalsePage gradeId={6} />}
          </Route>
          <Route path="/personality" component={PersonalityGamePage} />
          <Route path="/completion" component={CompletionPage} />
          <Route path="/achievements" component={AchievementsPage} />
          <Route path="/lessons" component={LessonsPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNav />
    </>
  );
}

type Step = "intro" | "grade-select" | "app";

function App() {
  const [step, setStep] = useState<Step>("intro");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div key="intro" {...fadeIn} style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
              <LampIntro onDone={() => setStep("grade-select")} />
            </motion.div>
          )}

          {step === "grade-select" && (
            <motion.div key="grade-select" {...fadeUp} style={{ position: "fixed", inset: 0, zIndex: 9998 }}>
              <GradeSelect onSelect={() => setStep("app")} />
            </motion.div>
          )}

          {step === "app" && (
            <motion.div key="app" {...fadeIn} style={{ width: "100%", minHeight: "100vh" }}>
              <WouterRouter base="/live">
                <ProgressProvider>
                  <Router />
                </ProgressProvider>
              </WouterRouter>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
