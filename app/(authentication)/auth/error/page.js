export default function Page({ searchParams }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 rounded-2xl border p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Sorry, something went wrong.</h2>
          {searchParams?.error ? (
            <p className="text-sm text-muted-foreground">Code error: {searchParams.error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
          )}
        </div>
      </div>
    </div>
  )
}
