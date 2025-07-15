using Microsoft.EntityFrameworkCore;

namespace FBTarjeta
{
    public class AplicationDbContext: DbContext
    {
        public AplicationDbContext(DbContextOptions<AplicationDbContext> options) : base(options)
        {
        }
        public DbSet<Models.TarjetaCredito> Tarjetas { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.TarjetaCredito>().ToTable("Tarjetas");
            base.OnModelCreating(modelBuilder);
        }
    }
}
