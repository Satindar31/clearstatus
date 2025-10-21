"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function InitialSetup() {
  const [useEmail, setUseEmail] = React.useState(true);
  const [allowedCheckers, setAllowedCheckers] = React.useState<string[]>([]);
  const [allowRegistrations, setAllowRegistrations] = React.useState(false);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Submitting setup", { useEmail, allowedCheckers });
    if (allowedCheckers.length === 0) {
      toast.error("Please select at least one allowed checker.");
      return;
    }
    console.log({ useEmail, allowedCheckers });
    const setupFetch = fetch("/api/config/setup", {
      method: "POST",
      body: JSON.stringify({
        setupEmail: useEmail,
        allowedCheckers,
        allowRegistrations
      }),
      cache: "no-store",
    }).catch((err) => {
      console.error("Error during setup:", err);
      throw err;
    });

    toast.promise(setupFetch, {
      loading: "Saving settings...",
      success: (data) => {
        router.push("/admin/dashboard");
        return "Settings saved successfully!";
      },
      error: "Failed to save settings. Please try again.",
    });
  }

  return (
    <form
      className="flex flex-col gap-4 border border-slate-100 rounded-md p-4"
      onSubmit={(e) => handleSubmit(e)}
    >
      <label>
        Use Email:
        <Switch checked={useEmail} onCheckedChange={setUseEmail} />
      </label>
      <div>
        <p>Allowed Checkers:</p>
        <div className="flex flex-row gap-2">
          <Label>Hetrixtools</Label>
          <Checkbox
            checked={allowedCheckers.includes("HETRIXTOOLS")}
            onCheckedChange={(checked) => {
              if (checked) {
                setAllowedCheckers([...allowedCheckers, "HETRIXTOOLS"]);
              } else {
                setAllowedCheckers(
                  allowedCheckers.filter((c) => c !== "HETRIXTOOLS")
                );
              }
            }}
          />
        </div>

        <div className="flex flex-row gap-2">
          <Label>Updown.io</Label>
          <Checkbox
            checked={allowedCheckers.includes("UPDOWN")}
            onCheckedChange={(checked) => {
              if (checked) {
                setAllowedCheckers([...allowedCheckers, "UPDOWN"]);
              } else {
                setAllowedCheckers(
                  allowedCheckers.filter((c) => c !== "UPDOWN")
                );
              }
            }}
          />
        </div>

        <div className="flex flex-row gap-2">
          <Label>Statuscake</Label>
          <Checkbox
            checked={allowedCheckers.includes("STATUSCAKE")}
            onCheckedChange={(checked) => {
              if (checked) {
                setAllowedCheckers([...allowedCheckers, "STATUSCAKE"]);
              } else {
                setAllowedCheckers(
                  allowedCheckers.filter((c) => c !== "STATUSCAKE")
                );
              }
            }}
          />
        </div>

         <div className="flex flex-row gap-2">
          <Label>Pingdom</Label>
          <Checkbox
            checked={allowedCheckers.includes("PINGDOM")}
            onCheckedChange={(checked) => {
              if (checked) {
                setAllowedCheckers([...allowedCheckers, "PINGDOM"]);
              } else {
                setAllowedCheckers(
                  allowedCheckers.filter((c) => c !== "PINGDOM")
                );
              }
            }}
          />
        </div>


      </div>
      <div className="flex flex-row items-center gap-2">
      <Label>
        Enable registrations?
      </Label>
      <Switch checked={allowRegistrations} onCheckedChange={setAllowRegistrations} />
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
