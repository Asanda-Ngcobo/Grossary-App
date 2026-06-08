"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/_utils/supabase/client";

const questions = [
  {
    key: "funnel",
    title: "Where did you hear about Grossary?",
    options: ["TikTok", "Instagram", "LinkedIn", "Friend", "Other"],
  },
  {
    key: "currentMethod",
    title: "How do you currently manage your grocery shopping?",
    options: [
      "Notes App",
      "Paper List",
      "Spreadsheet",
      "Calculator",
      "Retailer App",
      "Nothing",
    ],
  },
];

export default function OnboardingSurveyPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [answers, setAnswers] = useState({
    funnel: "",
    currentMethod: "",
    challenge: [],
    weeklyFeatures: [],
    cheapestStoreInterest: "",
    feedback: "",
  });

  const totalSteps = 6;

  const next = () => setStep((p) => p + 1);
  const back = () => setStep((p) => p - 1);

  const toggleArrayValue = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const saveSurvey = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw authError;

      const { error } = await supabase.from("onboarding_surveys").insert({
        user_id: user.id,
        email: user.email,
        funnel: answers.funnel,
        current_method: answers.currentMethod,
        challenge: answers.challenge,
        weekly_features: answers.weeklyFeatures,
        cheapest_store_interest: answers.cheapestStoreInterest,
        feedback: answers.feedback,
      });

      if (error) throw error;

      // 👇 mark user as surveyed
const { error: profileError } = await supabase
  .from("users_info")
  .update({ surveyed: true })
  .eq("id", user.id);

if (profileError) throw profileError;

      router.push("/account/forms/tutorial");
    } catch (err) {
      console.error("Survey submission failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-xl">

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              Question {step + 1} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-green-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* STEP 1–2 */}
        {step <= 1 && (
          <>
            <h1 className="mb-8 text-3xl font-bold">
              {questions[step].title}
            </h1>

            <div className="space-y-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setAnswers((prev) => ({
                      ...prev,
                      [questions[step].key]: option,
                    }));
                    next();
                  }}
                  className="w-full rounded-2xl border p-5 text-left hover:border-green-500 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <>
            <h1 className="mb-8 text-3xl font-bold">
              What is your biggest challenge when grocery shopping?
            </h1>

            <div className="space-y-3">
              {[
                "Overspending",
                "Forgetting items",
                "Leaving loyalty cards at home",
                "All of the above",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-xl border p-4"
                >
                  <input
                    type="checkbox"
                    checked={answers.challenge.includes(item)}
                    onChange={() => toggleArrayValue("challenge", item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <button
              onClick={next}
              className="mt-8 w-full rounded-xl bg-[#0B2E1E] py-4 font-medium text-white"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <>
            <h1 className="mb-8 text-3xl font-bold">
              Which feature would make you use Grossary every week or month?
            </h1>

            <div className="space-y-3">
              {[
                "Grocery List Creation",
                "Spend Tracking",
                "Monthly Reports",
                "Loyalty Cards Access",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-xl border p-4"
                >
                  <input
                    type="checkbox"
                    checked={answers.weeklyFeatures.includes(item)}
                    onChange={() => toggleArrayValue("weeklyFeatures", item)}
                  />
                  {item}
                </label>
              ))}
            </div>

            <button
              onClick={next}
              className="mt-8 w-full rounded-xl bg-[#0B2E1E] py-4 font-medium text-white"
            >
              Continue
            </button>
          </>
        )}

        {/* STEP 5 */}
        {step === 4 && (
          <>
            <h1 className="mb-8 text-3xl font-bold">
              Would you recommend Grossary to a friend?
            </h1>

            <div className="space-y-3">
              {["Definitely", "Maybe", "No"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setAnswers((prev) => ({
                      ...prev,
                      cheapestStoreInterest: option,
                    }));
                    next();
                  }}
                  className="w-full rounded-2xl border p-5 text-left hover:border-[#1EC677]"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 6 */}
        {step === 5 && (
          <>
            <h1 className="mb-4 text-3xl font-bold">
              Anything you would like us to improve?
            </h1>

            <p className="mb-6 text-gray-500">Optional</p>

            <textarea
              rows={6}
              value={answers.feedback}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  feedback: e.target.value,
                }))
              }
              className="w-full rounded-xl border p-4"
              placeholder="Tell us what you think..."
            />

            <button
              onClick={saveSurvey}
              disabled={isSubmitting}
              className={`mt-8 w-full rounded-xl py-4 font-medium text-white transition
                ${isSubmitting ? "bg-gray-400" : "bg-[#0B2E1E] hover:bg-[#1EC677]"}
              `}
            >
              {isSubmitting ? "Saving..." : "Finish"}
            </button>
          </>
        )}

        {/* Back button */}
        {step > 0 && step < totalSteps && (
          <button onClick={back} className="mt-6 text-sm text-gray-500">
            ← Back
          </button>
        )}
      </div>
    </main>
  );
}