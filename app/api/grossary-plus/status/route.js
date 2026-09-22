import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/app/_utils/supabase/server";


export async function GET() {

  try {

    const supabase =
      await createClient();


    // ==================================
    // AUTH
    // ==================================

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();


    if (
      authError ||
      !user
    ) {

      return NextResponse.json(
        {
          authenticated:
            false,

          isPlus:
            false,
        },
        {
          status:
            401,
        }
      );
    }


    // ==================================
    // PROFILE
    // ==================================

    const {
      data: profile,
      error,
    } =
      await supabase
        .from("users_info")
        .select(`
          is_plus,
          plus_status,
          plus_trial_ends_at,
          plus_current_period_end
        `)
        .eq(
          "id",
          user.id
        )
        .single();


    if (error) {

      console.error(
        "Grossary Plus status error:",
        error
      );


      return NextResponse.json(
        {
          error:
            "Unable to check Grossary Plus status.",
        },
        {
          status:
            500,
        }
      );
    }


    return NextResponse.json({
      authenticated:
        true,

      isPlus:
        profile?.is_plus ===
        true,

      status:
        profile?.plus_status ||
        "inactive",

      trialEndsAt:
        profile?.plus_trial_ends_at ||
        null,

      currentPeriodEnd:
        profile
          ?.plus_current_period_end ||
        null,
    });


  } catch (error) {

    console.error(
      "Grossary Plus status error:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Unable to check Grossary Plus status.",
      },
      {
        status:
          500,
      }
    );

  }
}